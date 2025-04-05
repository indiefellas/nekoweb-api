import type { Config } from './classes';

const BASE_URL = "https://nekoweb.org/api";

export class NekoAPI {
	private config: Config;
	constructor(config: Config) {
		this.config = config;
	}

	async generic(route: String) {
		try {
			const response = await fetch(new URL(BASE_URL + route).href, {
				method: "GET",
				headers: { "Authorization": this.config.apiKey ?? "" }
			});
			if (!response.ok) {
				throw new Error(`Generic request failed with the code ${response.status}`);
			}
			return response.json()
		} catch (error) {
			throw new Error(`Failed to do generic request to ${BASE_URL + route}: ${error}`);
		}
	}

	async getSiteInfo(username: String = "") {
		if (!username) {
			// get self
			if (!this.config.apiKey) throw new Error("Failed to retrieve site info, missing api key");
			return await this.generic("/site/info")
		} else {
			return await this.generic(`/site/info/${username}`)
		}
	}
}
