import { Config } from './classes';

const BASE_URL = "https://nekoweb.org/api";

export class NekoAPI {
	config: Config;
	constructor(config: Config) {
		this.config = config;
	}

	async generic(route: String) {
		try {
			const response = await fetch(BASE_URL + route, {
				method: "GET",
				headers: { "Authorization": this.config.apiKey ?? "" }
			});
			if (!response.ok) {
				throw new Error(`Generic request failed with the code ${response.status}`);
			}
			return response.json
		} catch (error) {
			throw new Error(`Failed to do generic request to ${BASE_URL + route}: ${error}`);
		}
	}
}
