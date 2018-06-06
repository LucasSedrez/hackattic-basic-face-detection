import * as aws from 'aws-sdk';
import { RekognitionService } from '../rekognition.service';

jest.mock('aws-sdk');

describe('rekognition service test', () => {

	function mockRekognition(detectFaces) {

		const Rekognition = jest.fn().mockImplementation(() => ({
			detectFaces
		}));

		(aws.Rekognition as any).mockImplementation(Rekognition);
	}

	let rekognitionService: RekognitionService;

	beforeEach(() => {

		(aws.Rekognition as any).mockClear();

		rekognitionService = new RekognitionService('accessKeyTest', 'secretAccessKeyTest');
	});

	it('should be a singleton', async () => {

		mockRekognition(jest.fn((_params, callback) => callback(null, {})));

		await rekognitionService.detectFaces('bucketTest', 'imagePathTest');

		expect(aws.Rekognition).toBeCalledWith({
			apiVersion: '2016-06-27',
			region: 'us-east-2',
			credentials: {
				accessKeyId: 'accessKeyTest',
				secretAccessKey: 'secretAccessKeyTest'
			}
		});

		await rekognitionService.detectFaces('bucketTest', 'imagePathTest');

		expect(aws.Rekognition).toHaveBeenCalledTimes(1);
	});

	it('should thrown an error', async () => {

		mockRekognition(jest.fn((_params, callback) => callback(new Error())));

		await expect(rekognitionService.detectFaces('bucketTest', 'imagePathTest')).rejects.toThrowError();
	});
});