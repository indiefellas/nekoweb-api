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

export type Config = {
    apiKey: string;
    cookie: string | undefined;
    appName: string | undefined;
}
