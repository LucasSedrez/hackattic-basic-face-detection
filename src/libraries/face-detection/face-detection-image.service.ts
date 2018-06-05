import sharp from 'sharp';
import { DetectFacesResponse } from 'aws-sdk/clients/rekognition';
import { FaceDetectionService } from './face-detection.service';
import { S3Service } from '../aws/s3.service';
import { BUCKET_NAME, IMAGE_PATH } from '../../common/settings/general';

export class FaceDetectionImage {

	constructor(
		private service: FaceDetectionService,
		private s3: S3Service
	) { }

	private generateSvgs(detectFacesReponse: DetectFacesResponse) {

		const xyPositions = this.service.getXY(detectFacesReponse);

		let svgs = '';

		if (xyPositions) {

			svgs = `<svg width="800" height="800">`;

			xyPositions.forEach(element => {

				if (element) {
					svgs += `<rect 
						 x="${element.x.toString()}" 
						 y="${element.y.toString()}"
						 width="${element.width.toString()}" 
						 height="${element.height.toString()}"
						 style="stroke-width:3;stroke:rgb(255,0,0);fill:rgba(124,240,10,0.5);" />`;
				}
			});

			svgs += `</svg>`;
		}

		return svgs;
	}

	public async generateImage(detectFacesReponse: DetectFacesResponse) {

		const image = await this.s3.getImage(BUCKET_NAME, IMAGE_PATH);

		const svgs = new Buffer(this.generateSvgs(detectFacesReponse));

		if (image.Body) {

			return sharp(image.Body as Buffer).overlayWith(svgs, { top: 0, left: 0 }).toFile('final.jpg');
		}
		
		throw new Error('ERRO AO GERAR IMAGEM!');
	}
}