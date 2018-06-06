import * as aws from 'aws-sdk';
import { S3Service } from '../s3.service';
import request from 'request-promise-native';

jest.mock('aws-sdk');

describe('s3 service test', () => {

	function mockS3(getObject, putObject?) {

		const S3 = jest.fn().mockImplementation(() => ({
			getObject,
			putObject
		}));

		(aws.S3 as any).mockImplementation(S3);
	}

	let s3Service: S3Service;

	beforeEach(() => {

		(aws.S3 as any).mockClear();

		s3Service = new S3Service('accessKeyTest', 'secretAccessKeyTest');
	});

	it('should be a singleton', async () => {

		mockS3(jest.fn((_params, callbak) => callbak(null, {})));

		await s3Service.getImage('bucketTest', 'imagePathTest');

		expect(aws.S3).toBeCalledWith({
			apiVersion: '2006-03-01',
			region: 'us-east-2',
			credentials: {
				accessKeyId: 'accessKeyTest',
				secretAccessKey: 'secretAccessKeyTest'
			}
		});

		await s3Service.getImage('bucketTest', 'imagePathTest');

		expect(aws.S3).toHaveBeenCalledTimes(1);
	});

	it('should call getImage with error', async () => {

		const getImage = jest.fn((_params, callbak) => callbak(new Error()));

		mockS3(getImage);

		await expect(s3Service.getImage('bucketTest', 'imagePathTest')).rejects.toThrowError();
		expect(getImage).toHaveBeenCalledWith({
			Bucket: 'bucketTest',
			Key: 'imagePathTest'
		}, expect.any(Function));
	});

	it('should call putObject correctly', async () => {

		const putObject = jest.fn((_params, callbak) => callbak(null, {}));

		mockS3(null, putObject);

		const params = {
			Bucket: 'bucketTest',
			Key: 'imagePathTest',
			Body: new Buffer('')
		};

		await expect(s3Service.putObject(params)).resolves.toEqual({});
		expect(putObject).toHaveBeenCalledWith(params, expect.any(Function));
	});

	it('should call putObject with error', async () => {

		const putObject = jest.fn((_params, callbak) => callbak(new Error()));

		mockS3(null, putObject);

		const params = {
			Bucket: 'bucketTest',
			Key: 'imagePathTest',
			Body: new Buffer('')
		};

		await expect(s3Service.putObject(params)).rejects.toThrowError();
		expect(putObject).toHaveBeenCalledWith(params, expect.any(Function));
	});

	it('should call uploadImageFromUrl correctly', async () => {

		const putObject = jest.fn((_params, callbak) => callbak(null, {}));

		mockS3(null, putObject);

		jest.spyOn(request, 'get').mockImplementation(jest.fn((options) => {

			return options.uri;
		}));

		await s3Service.uploadImageFromUrl('http://teste.com/image', 'bucketTest', 'imagePathTest');

		expect(putObject).toHaveBeenCalledWith({
			Bucket: 'bucketTest',
			Key: 'imagePathTest',
			Body: 'http://teste.com/image'
		}, expect.any(Function));
	});
});