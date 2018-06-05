import { S3 } from 'aws-sdk';
import request from 'request-promise-native';

export class S3Service {

	private s3: S3;

	constructor(
		private accessKey: string,
		private secretAccessKey: string) { }

	private getInstance(): S3 {

		if (!this.s3) {

			this.s3 = new S3({
				apiVersion: '2006-03-01',
				region: 'us-east-2',
				credentials: {
					accessKeyId: this.accessKey,
					secretAccessKey: this.secretAccessKey
				}
			});
		}

		return this.s3;
	}

	public async uploadImageFromUrl(url: string, bucket: string, key: string) {

		const options = {
			uri: url,
			encoding: null
		};

		const response = await request.get(options);

		return new Promise((resolve, reject) => {

			return this.getInstance().putObject({
				Bucket: bucket,
				Key: key,
				Body: response
			}, (err, data) => {

				if (err) {

					return reject(err);
				}

				return resolve(data);
			});
		});
	}

	public getImage(bucket: string, key: string) {

		return new Promise<S3.GetObjectOutput>((resolve, reject) => {

			return this.getInstance().getObject({
				Bucket: bucket,
				Key: key
			}, (err, data) => {

				return err ? reject(err) : resolve(data);
			});
		});
	}

}