import { ImageService, PositionsService } from "..";
import { S3Service } from "../../aws/s3.service";
import { data } from "./detecetd-faces-data";
import * as aws from 'aws-sdk';

jest.mock('aws-sdk');

describe('image service test', () => {

	function mockS3(getObject, putObject?) {

		const S3 = jest.fn().mockImplementation(() => ({
			getObject,
			putObject
		}));

		(aws.S3 as any).mockImplementation(S3);
	}

	let imageService: ImageService;

	beforeEach(() => {

		const s3Service = new S3Service('accessKeyTest', 'secretAccessKeyTest');
		const positionsService = new PositionsService();

		imageService = new ImageService(positionsService, s3Service);
	});

	it('should generateImage', async () => {

		const getObject = jest.fn(
			(_params, callbak) => {
				return callbak(null, { Body: new Buffer('<svg width="800" height="800"></svg>') })
			}
		);

		const putObject = jest.fn(
			(_params, callbak) => {
				return callbak(null, { Body: new Buffer('<svg width="800" height="800"></svg>') })
			}
		);

		mockS3(getObject, putObject);

		const generatedImage = await imageService.generateImage(data);

		await expect(generatedImage.Body).toEqual(new Buffer('<svg width="800" height="800"></svg>'));
	});

	it('should generateImage return an error as can not generate the image', async () => {

		mockS3(jest.fn((_params, callbak) => callbak(null, {})));

		await expect(imageService.generateImage(data)).rejects.toThrowError('Can\'t generate the image!');
	});
});