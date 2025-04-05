import type { ZodSchema } from 'zod';
import { siteSchema, type Site } from './objects.js';
import { type Config } from './types.js';

const BASE_URL = "https://nekoweb.org/api";

export default class NekowebAPI {
	private config: Config;
	constructor(config: Config) {
		this.config = config;
	}

	async generic<T>(route: String, schema: ZodSchema<T>): Promise<T> {
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

	async getSiteInfo(username: String = ""): Promise<Site> {
		if (!username) {
			if (!this.config.apiKey) throw new Error("Failed to retrieve site info, missing api key");
			return this.generic<Site>("/site/info", siteSchema)
		} else {
			return this.generic<Site>(`/site/info/${username}`, siteSchema)
		}
	}
}