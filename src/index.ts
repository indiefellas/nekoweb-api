import type { HeadersInit } from 'bun';
import { Folder, type ILimits, Limits, Site, type IFolder, type ISite } from './classes.js';
import { type Config, type UploadFileInit } from './types.js';

const BASE_URL = "https://nekoweb.org/api";

export default class NekowebAPI {
	private config: Config;
	constructor(config: Config) {
		this.config = config;
	}

	private async generic<T>(route: String, init?: RequestInit, hdrs?: HeadersInit): Promise<T>;
	private async generic(route: String, init?: RequestInit, hdrs?: HeadersInit): Promise<string>;
	private async generic<T>(route: String, init?: RequestInit, hdrs?: HeadersInit): Promise<T | string> {
		try {
			const headers: HeadersInit = { 
				Authorization: this.config.apiKey ?? "",
				"User-Agent": `${this.config.appName || "NekowebAPI"}/1.0`,
				...this.config.headers || {},
				...hdrs || {}
			}

			const response = await fetch(new URL(BASE_URL + route).href, {
				headers: headers,
				...init
			});
			if (!response.ok) {
				throw new Error(`Generic failed with the code ${response.status} (${await response.text()})`);
			}
			if (response.headers.get('Content-Type')?.includes('application/json')) {
				return response.json() as T;
			} else {
				return response.text();
			}
		} catch (error) {
			throw new Error(`Failed to do request to ${BASE_URL + route}: ${error}`);
		}
	}

	/**
	 * Gets a Nekoweb site's information.
	 * @param username The username of the site (usually [username].nekoweb.org)
	 * @returns A Site object that contains the site's information
	 */
	async getSiteInfo(username: String = ""): Promise<Site> {
		if (!username) {
			if (!this.config.apiKey) throw new Error("Failed to retrieve site info, missing api key");
			return await this.generic<ISite>("/site/info")
		} else {
			return await this.generic<ISite>(`/site/info/${username}`)
		}
	}

	/**
	 * Gets the current file limits.
	 * @returns The current file limits before you get rate limited.
	 */
	async getFileLimits(): Promise<Limits> {
		return await this.generic<ILimits>('/files/limits')
	}

	/**
	 * Gets the directory's contents.
	 * @param path The path of the directory. Defaults to /.
	 * @returns An array of the contents of the folder.
	 */
	async listDir(path: string = "/"): Promise<Folder[]> {
		return await this.generic<IFolder[]>(`/files/readfolder?pathname=${encodeURIComponent(path)}`)
	}

	/**
	 * Creates a file/folder.
	 * @param path The path of the file/folder.
	 * @param isFolder If it should be created as a folder.
	 */
	async create(path: string, isFolder: boolean) {
		return this.generic('/files/create', {
			method: 'POST',
			body: `pathname=${encodeURIComponent(path)}&isFolder=${encodeURIComponent(isFolder)}`
		}, {
			"Content-Type": 'application/x-www-form-urlencoded'
		})
	}

	/**
	 * Uploads the specific file to Nekoweb.
	 * @param path The input path of the file.
	 * @param file The Buffer of the file.
	 */
	async upload(path: string, file: Buffer) {
		let data = new FormData() as any;
		const parts = path.split('/').filter(Boolean);
		const filename = parts.pop() ?? 'file.bin';
		const dirname = '/' + parts.join('/');

		data.append("pathname", dirname);
		data.append("files", new File([file], filename));

		return this.generic('/files/upload', {
			method: 'POST',
			body: data,
		})
	}

	/**
	 * Deletes a specific file/folder.
	 * @param path The path of the file/folder
	 */
	async delete(path: string) {
		return this.generic('/files/delete', {
			method: 'POST',
			body: `pathname=${path}`
		}, {
			"Content-Type": 'application/x-www-form-urlencoded'
		})
	}

	/**
	 * Renames or moves a file/folder.
	 * @param oldPath The path of the file/folder.
	 * @param newPath The new path of the file/folder.
	 */
	async rename(oldPath: string, newPath: string) {
		return this.generic('/files/rename', {
			method: 'POST',
			body: `pathname=${oldPath}&newpathname=${newPath}`
		}, {
			"Content-Type": 'application/x-www-form-urlencoded'
		})
	}

	/**
	 * Edits a file.
	 * @param path The path of the file.
	 * @param content The content of the file.
	 */
	async edit(path: string, content: string) {
		let data = new FormData() as any; // get fucked
		data.append("pathname", path);
		data.append("content", content);

		return this.generic('/files/edit', {
			method: 'POST',
			body: data,
		})
	}

	/**
	 * 
	 */
}