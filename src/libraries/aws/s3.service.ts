import { S3 } from 'aws-sdk';
import request from 'request';

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

    public uploadImageFromUrl(url: string, bucket: string, key: string, callback) {

        request({
            url: url,
            encoding: null
        }, (err, res, body) => {

            if (err) {
                return callback(err, res);
            }

            this.getInstance().putObject({
                Bucket: bucket,
                Key: key,
                Body: body // buffer
            }, callback);
        });
    }

}