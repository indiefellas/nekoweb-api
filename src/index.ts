import axios from 'axios';
import { Config } from './classes';

const BASE_URL = "https://nekoweb.org/api";

export class NekowebAPI {
	config: Config;
	constructor(config: Config) {
		this.config = config;
	}

	// NOTE: expects 'route' and 'config'
	async generic(route: String) {
		try {
			// TODO: add configuration support (auth, etc etc)
			// NOTE: fuck it's been awhile since i last wrote anything in javascripte -iv
			//       please do not kill me for my bad code
			const response = await axios.get(BASE_URL + route);
			const data = await response.data;
			return data
		} catch {
			throw new Error(`Unable to do generic request to ${BASE_URL + route}`);
		}
	}
}
