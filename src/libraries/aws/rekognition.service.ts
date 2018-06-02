import { Rekognition } from 'aws-sdk';

export class RekognitionService {

    private rekognition: Rekognition;

    constructor(
        private accessKey: string,
        private secretAccessKey: string) { }


    private getInstance(): Rekognition {

        if (!this.rekognition) {

            this.rekognition = new Rekognition({
                apiVersion: '2016-06-27',
                region: 'us-east-2',
                credentials: {
                    accessKeyId: this.accessKey,
                    secretAccessKey: this.secretAccessKey
                }
            });
        }

        return this.rekognition;
    }

    public detectFaces(bucket: string, imageName: string, callback) {

        return this.getInstance().detectFaces({
            Image: {
                S3Object: {
                    Bucket: bucket,
                    Name: imageName
                }
            }
        }, (err, data) => {

            return callback(err, data);
        });
    }
}