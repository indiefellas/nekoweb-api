import type { Config, Site } from './types';

const BASE_URL = "https://nekoweb.org/api";

// TODO: impl files and the rest of the api
export class NekowebAPI {
	private config: Config;
	constructor(config: Config) {
		this.config = config;
	}

	async generic<T>(route: String): Promise<T> {
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
			let res = await response.json() as T;
			let site: T = {
				...res
			}
			return site;
			// NOTE: custom jank type manipulation lawl
		} catch (error) {
			throw new Error(`Failed to do generic request to ${BASE_URL + route}: ${error}`);
		}
	}

	async getSiteInfo(username: String = "") {
		if (!username) {
			if (!this.config.apiKey) throw new Error("Failed to retrieve site info, missing api key");
			return this.generic<Site>("/site/info")
		} else {
			return this.generic<Site>(`/site/info/${username}`)
		}
	}
}
