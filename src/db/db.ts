import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema.js";

// Create SQLite database connection
const sqlite = new Database("hackathon.db");
