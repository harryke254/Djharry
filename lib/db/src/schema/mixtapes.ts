import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mixtapesTable = pgTable("mixtapes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  genre: text("genre"),
  coverImagePath: text("cover_image_path"),
  audioPath: text("audio_path").notNull(),
  tracklistText: text("tracklist_text"),
  downloadCount: integer("download_count").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  releaseDate: timestamp("release_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertMixtapeSchema = createInsertSchema(mixtapesTable).omit({ id: true, createdAt: true, updatedAt: true, downloadCount: true });
export type InsertMixtape = z.infer<typeof insertMixtapeSchema>;
export type Mixtape = typeof mixtapesTable.$inferSelect;
