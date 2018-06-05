import { S3Service } from "../../aws/s3.service";
import { RekognitionService } from "../../aws/rekognition.service";
import { HackatticService } from "../../hackattic/hackattic.service";
import { PositionsService, ImageService } from "..";
import { BUCKET_NAME, IMAGE_PATH } from "../../../common/settings/general";

export class BasicFacade {

	constructor(
		private s3: S3Service,
		private rekognition: RekognitionService,
		private hackattic: HackatticService,
		private positionsService: PositionsService,
		private imageService: ImageService
	) { }

	private async detectFaces() {

		const imageUrl = await this.hackattic.getImageUrl();

		await this.s3.uploadImageFromUrl(imageUrl, BUCKET_NAME, IMAGE_PATH);

		return this.rekognition.detectFaces(BUCKET_NAME, IMAGE_PATH);
	}

	public async solveTheProblem() {

		const detectedFaces = await this.detectFaces();

		const positions = this.positionsService.findPositions(detectedFaces);

		return this.hackattic.solve(positions);
	}

	public async showMeTheFaces() {

		const detectedFaces = await this.detectFaces();

		return this.imageService.generateImage(detectedFaces);
	}
}