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
}).transform(data => ({
    id: data.id,
    username: data.username,
    title: data.title,
    updates: data.updates,
    followers: data.followers,
    views: data.views,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdAtDate: new Date(data.created_at),
    updatedAtDate: new Date(data.updated_at),
}));

export type Site = z.infer<typeof siteSchema>;

export const folderSchema = z.object({
    name: z.string(),
    dir: z.boolean(),
});

export type Folders = z.infer<typeof folderSchema>[];

export const bigIdSchema = z.object({
    id: z.string(),
});

export type BigId = z.infer<typeof bigIdSchema>;