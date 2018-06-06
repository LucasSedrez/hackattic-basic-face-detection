import * as request from "request-promise-native";
import { ImageUrl } from "./interfaces/image-url.interface";

export class HackatticService {

	private baseUrl = 'https://hackattic.com/challenges/basic_face_detection/{type}';
	private accessToken = '?access_token=';
	private playground = '&playground=1';

	constructor(apiKey: string, private isPlayground: boolean) {

		this.accessToken += apiKey;
	}

	public async getImageUrl(): Promise<string> {

		var options = {
			uri: this.baseUrl.replace('{type}', 'problem') + this.accessToken
		};

		const data = await request.get(options);

		const parsedData = JSON.parse(data) as ImageUrl;

		return parsedData.image_url;
	}

	public async solve(positions: number[][]) {

		let uri = this.baseUrl.replace('{type}', 'solve') + this.accessToken;

		if (this.isPlayground) {

			uri += this.playground;
		}

		var options = {
			method: 'POST',
			uri,
			body: {
				face_tiles: positions
			},
			json: true
		};

		return request.post(options);
	}
}