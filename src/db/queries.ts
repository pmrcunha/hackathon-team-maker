import { db } from "./db.js"; // Your drizzle database instance
import { users, topics } from "./schema.js";
import { eq, desc, isNull } from "drizzle-orm";

/**
 * User Operations
 */

// Create a new user
export async function createUser(email: string, name: string) {
  const result: any = await db
    .insert(users)
    .values({
      email,
      name,
    })
    .returning();

  return result[0];
}

// Get all users
export async function getAllUsers() {
  const allUsers = await db.query.users.findMany({
    with: {
      currentTopic: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: desc(users.createdAt),
  });

  return allUsers;
}

// Get user by ID
export async function getUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

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

// Update user
export async function updateUser(
  userId: string,
  data: { email?: string; name?: string },
) {
  const result: any = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return result[0];
}

// Delete user
export async function deleteUser(userId: string) {
  const result: any = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning();

  return result[0];
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
  // Create the topic first
  const topicResult: any = await db
    .insert(topics)
    .values({
      title,
      description,
      creatorId: userId,
    })
    .returning();

  const topic = topicResult[0];

  // Automatically join the user to this topic
  // This will remove them from any other topic they were in
  await db
    .update(users)
    .set({
      currentTopicId: topic.id,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return topic;
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

// Get topic by ID
export async function getTopicById(topicId: string) {
  const topic = await db.query.topics.findFirst({
    where: eq(topics.id, topicId),
  });

  return topic;
}

// Update topic
export async function updateTopic(
  topicId: string,
  data: { title?: string; description?: string },
) {
  const result: any = await db
    .update(topics)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(topics.id, topicId))
    .returning();

  return result[0];
}

// Delete topic
export async function deleteTopic(topicId: string) {
  // First, remove all users from this topic
  await db
    .update(users)
    .set({
      currentTopicId: null,
      updatedAt: new Date(),
    })
    .where(eq(users.currentTopicId, topicId));

  // Then delete the topic
  const deleteResult: any = await db
    .delete(topics)
    .where(eq(topics.id, topicId))
    .returning();

  return deleteResult[0];
}
