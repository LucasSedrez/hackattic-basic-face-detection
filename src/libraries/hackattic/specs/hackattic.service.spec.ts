import { HackatticService } from '../hackattic.service';
import request from 'request-promise-native';

jest.mock('request-promise-native');

describe('hackattic service test', () => {

	let hackaticService: HackatticService;

	beforeEach(() => {

		hackaticService = new HackatticService('tokenTest', true);
	});

	it('should getImageUrl', async () => {

		const get = jest.fn((_options) => {

			return JSON.stringify({
				image_url: 'http://imageTest.com'
			});
		});

		jest.spyOn(request, 'get').mockImplementation(get);

		await expect(hackaticService.getImageUrl()).resolves.toEqual('http://imageTest.com');
		expect(get).toHaveBeenCalledWith({
			uri: 'https://hackattic.com/challenges/basic_face_detection/problem?access_token=tokenTest'
		});
	});

	it('should solve the problem', async () => {

		hackaticService = new HackatticService('tokenTest', false);

		const data = [[3, 5], [7, 6], [5, 1], [2, 1]];

		const post = jest.fn((_options) => {

			return {};
		});

		jest.spyOn(request, 'post').mockImplementation(post);

		await expect(hackaticService.solve(data)).resolves.toEqual({});
		expect(post).toHaveBeenCalledWith({
			method: 'POST',
			uri: 'https://hackattic.com/challenges/basic_face_detection/solve?access_token=tokenTest',
			body: { face_tiles: data },
			json: true
		});
	});

	it('should solve the problem in playground mode', async () => {

		const data = [[1, 0], [0, 1], [2, 4], [4, 2]];

		const post = jest.fn((_options) => {

			return {};
		});

		jest.spyOn(request, 'post').mockImplementation(post);

		await expect(hackaticService.solve(data)).resolves.toEqual({});
		expect(post).toHaveBeenCalledWith({
			method: 'POST',
			uri: 'https://hackattic.com/challenges/basic_face_detection/solve?access_token=tokenTest&playground=1',
			body: { face_tiles: data },
			json: true
		});
	});

});