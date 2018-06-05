import * as request from "request-promise-native";
import { ImageUrl } from "./interfaces/image-url.interface";

export class HackatticService {

	private baseUrl = 'https://hackattic.com/challenges/basic_face_detection/problem';
	private accessToken = '?access_token=';

	constructor(apiKey: string) {

		this.accessToken += apiKey;
	}

	public async getImageUrl(): Promise<string> {

		var options = {
			uri: this.baseUrl + this.accessToken
		};

		const data = await request.get(options);

		const parsedData = JSON.parse(data) as ImageUrl;

		return parsedData.image_url;
	}

	public async solve(data: any) {

		var options = {
			method: 'POST',
			uri: this.baseUrl.replace('problem', 'solve') + this.accessToken + '&playground=1',
			body: {
				face_tiles: data
			},
			json: true
		};

		return request.post(options);
	}
}