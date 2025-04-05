import type { HeadersInit } from 'bun';
import { Folder, Site, type IFolder, type ISite } from './classes.js';
import { type Config } from './types.js';

const BASE_URL = "https://nekoweb.org/api";

export default class NekowebAPI {
	private config: Config;
	constructor(config: Config) {
		this.config = config;
	}

	private async generic<T>(route: String): Promise<T> {
		try {
			const headers: HeadersInit = { 
				Authorization: this.config.apiKey ?? "",
				"User-Agent": `${this.config.appName || "NekowebAPI"}/1.0`
			}
			if (this.config.cookie) {
				headers.Cookie = `token=${this.config.cookie}`;
				headers.Referer = `https://nekoweb.org/?${encodeURIComponent(
					`${this.config.appName || "NekowebAPI"} using @indiefellas/nekoweb-api`
				)}`;
			}

			const response = await fetch(new URL(BASE_URL + route).href, {
				method: "GET",
				headers: headers
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