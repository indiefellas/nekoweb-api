import { z, type ZodSchema } from 'zod';

declare class NekowebAPI {
    private config: Config;
    constructor(config: Config);
    private generic<T>(route: string, schema: ZodSchema<T>): Promise<T>;
    getSiteInfo(username?: string): Promise<Site>;
}

export interface Config {
    /** Your Nekoweb API key. */
    apiKey: string;
    /** Your Nekoweb account cookie. */
    cookie?: string | undefined;
    /** The application name. */
    appName?: string | undefined;
}

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

export type Folder = z.infer<typeof folderSchema>;

export const bigIdSchema = z.object({
    id: z.string(),
});

export type BigId = z.infer<typeof bigIdSchema>;

export default NekowebAPI;
export { Objects, Types };