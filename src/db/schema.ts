import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

/**
 * Users Table
 * Stores user information and tracks which topic they're currently joined to
 */
export const users: any = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", { mode: "boolean" })
      .default(true)
      .notNull(),
    image: text("image"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),

    // Track which topic the user is currently a member of (can only be one at a time)
    currentTopicId: text("current_topic_id").references((): any => topics.id, {
      onDelete: "set null",
    }),
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

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp_ms",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp_ms",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
