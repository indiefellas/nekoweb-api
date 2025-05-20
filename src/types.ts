import type { AxiosRequestConfig } from "axios";

export enum LogType {
    Info,
    Warn,
    Error
}

export type Logging = (logType: LogType, message: string) => void;

export class Config {
    /** Your Nekoweb API key. */
    apiKey: string = '';
    /** The application name. */
    appName?: string | undefined;
    /** Additional headers to pass */
    request?: AxiosRequestConfig | undefined;
    /** Optional logging handler */
    logging?: Logging;

    constructor() {
        if (!this.logging) {
            this.logging = (type, message) => {
                console.log(message)
            };
        }
    }
}

export type UploadFileInit = {
    data: Buffer;
    filePath: string;
}