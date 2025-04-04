export class Site {
    id: number = 0;
    username: string = "";
    title: string = "";
    updates: number = 0;
    followers: number = 0;
    views: number = 0;
    createdAt: number = 0;
    updatedAt: number = 0;
    createdAtDate: Date = new Date(this.createdAt);
    updatedAtDate: Date = new Date(this.updatedAt);
}

export class Folder {
    name: string = "";
    dir: boolean = false;
}

export class BigId {
    id: string = "";
}

export class Config {
    apiKey: string;
    cookie: string;
    appName: string;

    constructor(apiKey: string, cookie: string, appName: string = "nekoweb-api") {
        this.apiKey = apiKey;
        this.cookie = cookie;
        this.appName = appName;
    }
}