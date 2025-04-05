import { Folder, Site, type IFolder, type ISite } from './classes.js';
import { type Config } from './types.js';

const BASE_URL = "https://nekoweb.org/api";

export default class NekowebAPI {
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
			return response.json() as T;
		} catch (error) {
			throw new Error(`Failed to do generic request to ${BASE_URL + route}: ${error}`);
		}
	}

	async getSiteInfo(username: String = ""): Promise<Site> {
		if (!username) {
			if (!this.config.apiKey) throw new Error("Failed to retrieve site info, missing api key");
			return await this.generic<ISite>("/site/info")
		} else {
			return await this.generic<ISite>(`/site/info/${username}`)
		}
	}

	async getDir(path: string = "/"): Promise<Folder[]> {
		return await this.generic<IFolder[]>(`/files/readfolder?pathname=${encodeURIComponent(path)}`)
	}
}