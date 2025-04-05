import type { HeadersInit } from "bun";

export type Config = {
    /** Your Nekoweb API key. */
    apiKey: string;
    /** The application name. */
    appName?: string | undefined;
    /** Additional headers to pass */
    headers?: HeadersInit | undefined;
}

export type UploadFileInit = {
    data: Buffer;
    filePath: string;
}