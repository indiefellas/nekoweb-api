import { z } from "zod";

export const siteSchema = z.object({
  id: z.number(),
  username: z.string(),
  title: z.string(),
  updates: z.number(),
  followers: z.number(),
  views: z.number(),
  created_at: z.number(),
  updated_at: z.number(),
});

export type Site = z.infer<typeof siteSchema>;

export const folderSchema = z.object({
  name: z.string(),
  dir: z.boolean(),
});

export const foldersSchema = z.array(folderSchema);

export type Folder = z.infer<typeof folderSchema>;

export const bigIdSchema = z.object({
    id: z.string(),
});

export type BigId = z.infer<typeof bigIdSchema>;