// import type { HeadersInit } from 'bun';
import { Folder, type ILimits, Limits, Site, type IFolder, type ISite } from './classes.js';
import { type Config, type UploadFileInit } from './types.js';
import FormData from 'form-data';
import fetch from 'node-fetch';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const BASE_URL = "https://nekoweb.org/api";

export enum Method {
	GET,
	POST
}

export default class NekowebAPI {
	private config: Config;
	constructor(config: Config) {
		this.config = config;
	}

	private async generic<T>(method: Method, route: String, init?: AxiosRequestConfig): Promise<T>;
	private async generic(method: Method, route: String, init?: AxiosRequestConfig): Promise<string>;
	private async generic<T>(method: Method, route: String, init?: AxiosRequestConfig): Promise<T | string> {
		try {
			const headers = { 
				Authorization: this.config.apiKey,
				...init?.headers ?? {}
			}

			let response: AxiosResponse<any, any> | null = null;

			switch (method) {
				case Method.GET:
					response = await axios.get<T>(BASE_URL + route, {
						...init,
						headers: headers
					})
					break;
				case Method.POST:
					response = await axios.post<T>(BASE_URL + route, {
						...init,
						headers: headers
					})
			}

			return response?.data;
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
			return await this.generic<ISite>(Method.GET, "/site/info")
		} else {
			return await this.generic<ISite>(Method.GET, `/site/info/${username}`)
		}
	}

	/**
	 * Gets the current file limits.
	 * @returns The current file limits before you get rate limited.
	 */
	async getFileLimits(): Promise<Limits> {
		return await this.generic<ILimits>(Method.GET, '/files/limits')
	}

	/**
	 * Gets the directory's contents.
	 * @param path The path of the directory. Defaults to /.
	 * @returns An array of the contents of the folder.
	 */
	async listDir(path: string = "/"): Promise<Folder[]> {
		return await this.generic<IFolder[]>(Method.GET, `/files/readfolder?pathname=${encodeURIComponent(path)}`)
	}

	/**
	 * Creates a file/folder.
	 * @param path The path of the file/folder.
	 * @param isFolder If it should be created as a folder.
	 */
	async create(path: string, isFolder: boolean) {
		return this.generic(Method.POST, '/files/create', {
			method: 'POST',
			data: `pathname=${encodeURIComponent(path)}&isFolder=${encodeURIComponent(isFolder)}`,
			headers: {
				"Content-Type": 'application/x-www-form-urlencoded'
			}
		})
	}

	/**
	 * Uploads the specific file to Nekoweb.
	 * @param path The input path of the file.
	 * @param file The Buffer of the file.
	 */
	async upload(path: string, file: Buffer) {
		let formData = new FormData();
		formData.append("pathname", path);
		formData.append("files", file);

		return this.generic(Method.POST, '/files/upload', {
			method: 'POST',
			data: formData,
			headers: {
				"Content-Type": 'multipart/form-data'
			}
		})
	}

	/**
	 * Deletes a specific file/folder.
	 * @param path The path of the file/folder
	 */
	async delete(path: string) {
		return this.generic(Method.POST, '/files/delete', {
			method: 'POST',
			data: `pathname=${path}`,
			headers: {
				"Content-Type": 'application/x-www-form-urlencoded'
			}
		})
	}

	/**
	 * Renames or moves a file/folder.
	 * @param oldPath The path of the file/folder.
	 * @param newPath The new path of the file/folder.
	 */
	async rename(oldPath: string, newPath: string) {
		return this.generic(Method.POST, '/files/rename', {
			method: 'POST',
			data: `pathname=${oldPath}&newpathname=${newPath}`,
			headers: {
				"Content-Type": 'application/x-www-form-urlencoded'
			}
		})
	}

	/**
	 * Edits a file.
	 * @param path The path of the file.
	 * @param content The content of the file.
	 */
	async edit(path: string, content: string) {
		let formData = new FormData();
		formData.append("pathname", path);
		formData.append("content", content, "test.txt");

		console.log(formData.getBuffer().toString())

		return this.generic(Method.POST, '/files/edit', {
			method: 'POST',
			data: formData,
			headers: {
				// "Content-Type": 'multipart/form-data'
			}
		})
	}
}