import sharp from 'sharp';
import { DetectFacesResponse } from 'aws-sdk/clients/rekognition';
import { FaceDetectionService } from './face-detection.service';
import { S3Service } from '../aws/s3.service';
import { BUCKET_NAME, IMAGE_PATH, FINAL_IMAGE_PATH } from '../../common/settings/general';

export class FaceDetectionImage {

	constructor(
		private service: FaceDetectionService,
		private s3: S3Service
	) { }

	public async generateImage(detectFacesReponse: DetectFacesResponse) {

		const image = await this.s3.getImage(BUCKET_NAME, IMAGE_PATH);

		const svgs = new Buffer(this.generateSvgs(detectFacesReponse));

		if (image.Body) {

			const finalImage = await sharp(image.Body as Buffer).overlayWith(svgs, { top: 0, left: 0 }).toBuffer();

			return this.saveToS3(finalImage);
		}

		throw new Error('Can\'t generate the image!');
	}

	private generateSvgs(detectFacesReponse: DetectFacesResponse) {

		const boundingBoxesPositions = this.service.getBoundingBoxesPositions(detectFacesReponse);

		let svgs = '';

		if (boundingBoxesPositions) {

			svgs = `<svg width="800" height="800">`;

			boundingBoxesPositions.forEach(boundingBox => {

				if (boundingBox) {
					svgs += `<rect 
						 x="${boundingBox.x.toString()}" 
						 y="${boundingBox.y.toString()}"
						 width="${boundingBox.width.toString()}" 
						 height="${boundingBox.height.toString()}"
						 style="stroke-width:3;stroke:rgb(255,0,0);fill:rgba(124,240,10,0.5);" />`;
				}
			});

			svgs += `</svg>`;
		}

		return svgs;
	}

	private async saveToS3(finalImage: Buffer) {

		await this.s3.putObject({
			Bucket: BUCKET_NAME,
			Key: FINAL_IMAGE_PATH,
			Body: finalImage
		});

		return this.s3.getImage(BUCKET_NAME, FINAL_IMAGE_PATH);
	}
}