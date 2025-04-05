import { siteSchema } from './objects';

const BASE_URL = "https://nekoweb.org/api";

export default class NekowebAPI {
    constructor(config) {
        this.config = config;
    }

    async generic(route, schema) {
        try {
            const response = await fetch(new URL(BASE_URL + route).href, {
                method: "GET",
                headers: { 
                    "Authorization": this.config.apiKey ?? "",
                    "User-Agent": `${this.config.appName || "NekowebAPI"}/1.0`
                }
            });
            if (!response.ok) {
                throw new Error(`Generic request failed with the code ${response.status}`);
            }
            let res = await response.json();
            return schema.parse(res);
        } catch (error) {
            throw new Error(`Failed to do generic request to ${BASE_URL + route}: ${error}`);
        }
    }

    async getSiteInfo(username = "") {
        if (!username) {
            if (!this.config.apiKey) throw new Error("Failed to retrieve site info, missing api key");
            return this.generic("/site/info", siteSchema)
        } else {
            return this.generic(`/site/info/${username}`, siteSchema)
        }
    } 
}
