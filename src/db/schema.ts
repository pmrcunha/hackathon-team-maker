import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/**
 * Users Table
 * Stores user information and tracks which topic they're currently joined to
 */
export const users: any = sqliteTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),

    // Track which topic the user is currently a member of (can only be one at a time)
    currentTopicId: text("current_topic_id").references((): any => topics.id, {
      onDelete: "set null",
    }),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table): any => {
    return {
      emailIdx: index("users_email_idx").on(table.email),
      currentTopicIdx: index("users_current_topic_idx").on(
        table.currentTopicId,
      ),
    };
  },
);

/**
 * Topics Table
 * Stores hackathon topic proposals
 */
export const topics: any = sqliteTable(
  "topics",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    description: text("description").notNull(),

    // User who proposed/created this topic
    creatorId: text("creator_id")
      .references((): any => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table): any => {
    return {
      creatorIdx: index("topics_creator_idx").on(table.creatorId),
      createdAtIdx: index("topics_created_at_idx").on(table.createdAt),
    };
  },
);

/**
 * Relations
 */

// User relations
export const usersRelations = relations(users, ({ one, many }) => ({
  // The topic the user is currently joined to
  currentTopic: one(topics, {
    fields: [users.currentTopicId],
    references: [topics.id],
    relationName: "currentMember",
  }),

  // Topics created by this user
  createdTopics: many(topics, {
    relationName: "creator",
  }),
}));

// Topic relations
export const topicsRelations = relations(topics, ({ one, many }) => ({
  // User who created this topic
  creator: one(users, {
    fields: [topics.creatorId],
    references: [users.id],
    relationName: "creator",
  }),

  // Users who are currently members of this topic
  currentMembers: many(users, {
    relationName: "currentMember",
  }),
}));

/**
 * Type exports for use in application code
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;
