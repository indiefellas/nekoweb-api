import { Folder, type ILimits, Limits, Site, type IFolder, type ISite } from './classes.js';
import { LogType, type Config, type UploadFileInit } from './types.js';
import axios, { AxiosError, AxiosHeaders, type AxiosRequestConfig } from 'axios';
import FormData from 'form-data';

const BASE_URL = "https://nekoweb.org/api";

export default class NekowebAPI {
	config: Config;
	constructor(config: Config) {
		this.config = config;
	}

	async generic<T>(route: String, init?: AxiosRequestConfig, hdrs?: any): Promise<T>;
	async generic(route: String, init?: AxiosRequestConfig, hdrs?: any): Promise<ArrayBuffer>;
	async generic<T>(route: String, init?: AxiosRequestConfig, hdrs?: any): Promise<T | ArrayBuffer> {
		try {
			const headers: AxiosHeaders = { 
				Authorization: this.config.apiKey ?? "",
				"User-Agent": `${this.config.appName || "NekowebAPI"}/1.0`,
				...hdrs || {}
			}

			const response = await axios<T | ArrayBuffer>({
				url: new URL(BASE_URL + route).href,
				headers: headers,
				...this.config.request ?? {},
				...init
			})

			return response.data as T;
		} catch (error) {
			throw new Error(`Failed to do request to ${BASE_URL + route}: Server returned ${(error as AxiosError).code} ${(error as AxiosError).response?.data}`);
		}
	}

	/**
	 * Gets a Nekoweb site's information.
	 * @param domain The domain of the site (usually [domain].nekoweb.org), defaults to your main site
	 * @returns A Site object that contains the site's information
	 */
	async getSiteInfo(domain: String = ""): Promise<Site> {
		const siteInfos = await this.getAllSiteInfo();
		if (!domain) {
			if (!this.config.apiKey) throw new Error("Failed to retrieve site info, missing api key");
			return siteInfos[0] || await this.generic<ISite>(`/site/info/`);
		} else {
			return siteInfos.find(s => s.domain === domain) || await this.generic<ISite>(`/site/info/${domain}`);
		}
	}

	/**
	 * Gets the info of all of your sites.
	 * @returns A array of Site objects that contains each site's information
	 */
	async getAllSiteInfo(): Promise<Array<Site>> {
		return (await this.generic<Array<ISite>>("/site/info_all")).map(s => ({
			...s,
			main: (s.main as unknown as number) === 1
		}))
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
	async create(path: string, isFolder: boolean = false) {
		return this.generic('/files/create', {
			method: 'POST',
			data: `pathname=${encodeURIComponent(path)}${isFolder? `&isFolder=${encodeURIComponent(isFolder)}` : ''}`
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
		let data = new FormData();
		const parts = path.split('/').filter(Boolean);
		const filename = parts.pop() ?? 'file.bin';
		const dirname = '/' + parts.join('/');

		if (file.byteLength >= (100 * 1024 * 1024)) {
			let bigFile = await this.createBigFile();
			bigFile.append(file);
			return bigFile.move(path);
		}

		data.append("pathname", dirname);
		data.append("files", new File([file], filename));

		return this.generic('/files/upload', {
			method: 'POST',
			data: data,
		}, {
			...data.getHeaders()
		})
	}

	/**
	 * Deletes a specific file/folder.
	 * @param path The path of the file/folder
	 */
	async delete(path: string) {
		return this.generic('/files/delete', {
			method: 'POST',
			data: `pathname=${encodeURIComponent(path)}`
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
			data: `pathname=${oldPath}&newpathname=${newPath}`
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
		let data = new FormData(); // get fucked
		data.append("pathname", path);
		data.append("content", content);

		return this.generic('/files/edit', {
			method: 'POST',
			data: data,
		}, {
			...data.getHeaders()
		})
	}

	/**
	 * Create upload for a big file. Allows you to upload files larger than 100MB.
	 * @returns A BigFile object
	 */
	async createBigFile(): Promise<BigFile> {
		let id = await this.generic<{"id": string}>('/files/big/create').then((res) => res.id)
		return new BigFile(id, this, this.config);
	}
}

/**
 * The functions for the BigFile API
 */
export class BigFile {
	id: string
	private api: NekowebAPI;
	private config: Config;

	constructor(id: string, api: NekowebAPI, config: Config) {
		this.id = id;
		this.config = config;
		this.api = api; // kinda fucked up but lets me uses generic
	}

	private calculateChunks(fileSize: number) {
		const maxChunkSize = 100 * 1024 * 1024;
		const minChunkSize = 10 * 1024 * 1024;
		const minChunks = 5;
	  
		let numberOfChunks = Math.ceil(fileSize / maxChunkSize);
		let chunkSize = Math.ceil(fileSize / numberOfChunks);
	  
		if (chunkSize < minChunkSize) {
		  chunkSize = minChunkSize;
		  numberOfChunks = Math.ceil(fileSize / chunkSize);
		}
	  
		if (numberOfChunks < minChunks) {
		  numberOfChunks = minChunks;
		  chunkSize = Math.ceil(fileSize / numberOfChunks);
		}
	  
		return { chunkSize, numberOfChunks };
	  };

	/**
	 * Append a file to a big file upload.
	 * @param file The Buffer of the file to append.
	 */
	async append(file: Buffer) {
		let uploadedBytes = 0;
		const { chunkSize, numberOfChunks } = this.calculateChunks(file.length);

		for (let chunkIndex = 0; chunkIndex < numberOfChunks; chunkIndex++) {
			const start = chunkIndex * chunkSize;
			const end = Math.min(start + chunkSize, file.length);
			const chunk = file.slice(start, end);

			this.config.logging!(LogType.Info, `Uploading chunk ${chunkIndex} (${chunk.length})`);
			await this.appendChunk(chunk);

			uploadedBytes += chunk.length;
		}
		return uploadedBytes;
	}

	/**
	 * Append a chunk to a big file upload.
	 * 
	 * Note: Chunks must be less than 100MB.
	 * @param chunk A Buffer of the chunked file.
	 */
	async appendChunk(chunk: Buffer) {
		let data = new FormData();

		data.append("id", this.id);
		data.append("file", chunk, { filename: `chunk-${Date.now()}.part` }); // :D

		return this.api.generic('/files/big/append', {
			method: 'POST',
			data: data,
		}, {
			...data.getHeaders()
		})
	}

	/**
	 * Move a big file upload to the final location.
	 * @param filepath The path of the file to move to.
	 */
	async move(filepath: string) {
		return this.api.generic('/files/big/move', {
			method: 'POST',
			data: `id=${this.id}&pathname=${encodeURIComponent(filepath)}`,
		})
	}

	/**
	 * Import a zip file from a big file upload.
	 * @param path The destination path of the imported ZIP file (default: /)
	 */
	async import(path: string = '/') {
		let limits = await this.api.getFileLimits();
		return this.api.generic(`/files/import/${this.id}`, {
			method: "POST",
			data: `path=${encodeURIComponent(path)}`
		})
	}
}