export type Site = {
    id: number;
    username: string;
    title: string;
    updates: number;
    followers: number;
    views: number;
    createdAt: number;
    updatedAt: number;
}

export type Folder = {
    name: string;
    dir: boolean;
}

export type BigId = {
    id: string;
}

//NOTE: yay jsdoc
export type Config = {
    /** Your Nekoweb API key. */
    apiKey: string;
    /** Your Nekoweb account cookie. */
    cookie: string | undefined;
    /** The application name. */
    appName: string | undefined;
}
