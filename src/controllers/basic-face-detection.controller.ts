
import { Router, Request, Response } from 'express';
import { HackatticService } from '../libraries/hackattic/hackattic.service';
import { ACCESS_TOKEN } from '../common/settings/hackattic.credentials';
import { S3Service } from '../libraries/aws/s3.service';
import { S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, REKOGNITION_ACCESS_KEY, REKOGNITION_SECRET_ACCESS_KEY } from '../common/settings/aws.credentials';
import { RekognitionService } from '../libraries/aws/rekognition.service';
import { PositionsService, ImageService } from '../libraries/face-detection';
import { BasicFacade } from '../libraries/face-detection/basic';

const router: Router = Router();

router.get('/solve', async (_req: Request, res: Response, next) => {

	try {

		const hackattic = new HackatticService(ACCESS_TOKEN, true);
		const s3 = new S3Service(S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY);
		const rekognition = new RekognitionService(REKOGNITION_ACCESS_KEY, REKOGNITION_SECRET_ACCESS_KEY);
		const positionsService = new PositionsService();
		const imageService = new ImageService(positionsService, s3);

		const facade = new BasicFacade(s3, rekognition, hackattic, positionsService, imageService);

		const solve = await facade.solveTheProblem();

		return res.send(solve);

	} catch (err) {

		next(err);
	}

});

router.get('/faces', async (_req: Request, res: Response, next) => {

	const hackattic = new HackatticService(ACCESS_TOKEN, true);
	const s3 = new S3Service(S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY);
	const rekognition = new RekognitionService(REKOGNITION_ACCESS_KEY, REKOGNITION_SECRET_ACCESS_KEY);
	const positionsService = new PositionsService();
	const imageService = new ImageService(positionsService, s3);

	const facade = new BasicFacade(s3, rekognition, hackattic, positionsService, imageService);

	try {

		const faces = await facade.showMeTheFaces();

		res.contentType('image/jpeg');
		return res.send(faces.Body);

	} catch (error) {

		next(error);
	}

});

export const BasicFaceDetectionController: Router = router;