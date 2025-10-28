import { db } from "./db"; // Your drizzle database instance
import { users, topics } from "./schema";
import { eq, desc, isNull, isNotNull, sql } from "drizzle-orm";

/**
 * User Operations
 */

// Create a new user
export async function createUser(email: string, name: string) {
  const [user] = await db
    .insert(users)
    .values({
      email,
      name,
    })
    .returning();

  return user;
}

// Get user by ID with their current topic
export async function getUserWithTopic(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      currentTopic: {
        with: {
          creator: true,
        },
      },
      createdTopics: true,
    },
  });

  return user;
}

/**
 * Topic Operations
 */

// Create a new topic
// When a user proposes a topic, they automatically join it
export async function proposeTopic(
  userId: string,
  title: string,
  description: string,
) {
  return await db.transaction(async (tx) => {
    // Create the topic
    const [topic] = await tx
      .insert(topics)
      .values({
        title,
        description,
        creatorId: userId,
      })
      .returning();

    // Automatically join the user to this topic
    // This will remove them from any other topic they were in
    await tx
      .update(users)
      .set({
        currentTopicId: topic.id,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return topic;
  });
}

// Get all topics with member counts
export async function getAllTopics() {
  // First get all topics with creator info
  const allTopics = await db.query.topics.findMany({
    with: {
      creator: {
        columns: {
          name: true,
        },
      },
      currentMembers: {
        columns: {
          id: true,
        },
      },
    },
    orderBy: desc(topics.createdAt),
  });

  // Map to include member count
  return allTopics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    creatorId: topic.creatorId,
    creatorName: topic.creator.name,
    createdAt: topic.createdAt,
    memberCount: topic.currentMembers.length,
  }));
}

// Get a topic with all its members
export async function getTopicWithMembers(topicId: string) {
  const topic = await db.query.topics.findFirst({
    where: eq(topics.id, topicId),
    with: {
      creator: true,
      currentMembers: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return topic;
}

/**
 * Join/Leave Operations
 */

// Join a topic (automatically leaves current topic if any)
export async function joinTopic(userId: string, topicId: string) {
  // Verify topic exists
  const topic = await db.query.topics.findFirst({
    where: eq(topics.id, topicId),
  });

  if (!topic) {
    throw new Error("Topic not found");
  }

  // Update user's current topic
  await db
    .update(users)
    .set({
      currentTopicId: topicId,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return topic;
}

// Leave current topic
export async function leaveTopic(userId: string) {
  await db
    .update(users)
    .set({
      currentTopicId: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

/**
 * Query Examples
 */

// Get all topics with no members
export async function getTopicsWithNoMembers() {
  const allTopics = await db.query.topics.findMany({
    with: {
      currentMembers: {
        columns: {
          id: true,
        },
      },
    },
  });

  // Filter to only topics with no members
  return allTopics
    .filter((topic) => topic.currentMembers.length === 0)
    .map((topic) => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
    }));
}

// Get all users not in any topic
export async function getUsersWithoutTopic() {
  const usersWithoutTopic = await db.query.users.findMany({
    where: isNull(users.currentTopicId),
  });

  return usersWithoutTopic;
}

// Get users in a specific topic
export async function getUsersInTopic(topicId: string) {
  const members = await db.query.users.findMany({
    where: eq(users.currentTopicId, topicId),
    columns: {
      id: true,
      name: true,
      email: true,
    },
  });

  return members;
}

// Get topic statistics
export async function getTopicStats(topicId: string) {
  const topic = await db.query.topics.findFirst({
    where: eq(topics.id, topicId),
    with: {
      creator: {
        columns: {
          name: true,
        },
      },
      currentMembers: {
        columns: {
          id: true,
        },
      },
    },
  });

  if (!topic) {
    return null;
  }

  return {
    topicId: topic.id,
    title: topic.title,
    memberCount: topic.currentMembers.length,
    creatorName: topic.creator.name,
    createdAt: topic.createdAt,
  };
}
