
import { Router, Request, Response } from 'express';
import { HackatticService } from '../libraries/hackattic/hackattic.service';
import { ACCESS_TOKEN } from '../common/settings/hackattic.credentials';
import { S3Service } from '../libraries/aws/s3.service';
import { S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, REKOGNITION_ACCESS_KEY, REKOGNITION_SECRET_ACCESS_KEY } from '../common/settings/aws.credentials';
import { BUCKET_NAME, IMAGE_PATH } from '../common/settings/general';
import { RekognitionService } from '../libraries/aws/rekognition.service';
import { FaceDetectionService } from '../libraries/face-detection/face-detection.service';
import { FaceDetectionImage } from '../libraries/face-detection/face-detection-image.service';

const router: Router = Router();

router.get('/solve', async (_req: Request, res: Response, next) => {

	try {

		const hackattic = new HackatticService(ACCESS_TOKEN, true);
		const s3 = new S3Service(S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY);
		const rekognition = new RekognitionService(REKOGNITION_ACCESS_KEY, REKOGNITION_SECRET_ACCESS_KEY);
		const faceDetectonService = new FaceDetectionService();
		const faceDetectionImage = new FaceDetectionImage(faceDetectonService, s3);

		const imageUrl = await hackattic.getImageUrl();

		await s3.uploadImageFromUrl(imageUrl, BUCKET_NAME, IMAGE_PATH);

		const detectedFaces = await rekognition.detectFaces(BUCKET_NAME, IMAGE_PATH);

		const positions = faceDetectonService.findPositions(detectedFaces);

		const solve = await hackattic.solve(positions);
		console.warn(solve);

		const finalImage = await faceDetectionImage.generateImage(detectedFaces);

		res.contentType('image/jpeg');
		return res.send(finalImage.Body);

	} catch (err) {

		next(err);
	}

});

export const BasicFaceDetectionController: Router = router;