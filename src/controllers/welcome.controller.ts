
import { Router, Request, Response } from 'express';
// import { data } from '../../test';
import { HackatticService } from '../libraries/hackattic/hackattic.service';
import { ACCESS_TOKEN } from '../common/settings/hackattic.credentials';
import { S3Service } from '../libraries/aws/s3.service';
import { S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, REKOGNITION_ACCESS_KEY, REKOGNITION_SECRET_ACCESS_KEY } from '../common/settings/aws.credentials';
import { RekognitionService } from '../libraries/aws/rekognition.service';
import { FaceDetectionService } from '../libraries/face-detection/face-detection.service';

const router: Router = Router();

router.get('/', async (_req: Request, res: Response) => {

    // const result: any = [];

    // for (let key in data) {

    //     let record = data[key];

    //     result.push({
    //         "top": record.Top * 800,
    //         "left": record.Left * 800
    //     });
    // }

    const hackattic = new HackatticService(ACCESS_TOKEN);

    const result = await hackattic.getImageUrl();

    const s3 = new S3Service(S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY);

    const rekognition = new RekognitionService(REKOGNITION_ACCESS_KEY, REKOGNITION_SECRET_ACCESS_KEY);

    const faceDetection = new FaceDetectionService();

    s3.uploadImageFromUrl(result, 'ls-image-recognition', 'media/img.jpg', (err) => {

        console.warn(err);

        rekognition.detectFaces('ls-image-recognition', 'media/img.jpg', (err, data) => {

            console.warn(err);

            console.warn(faceDetection.parseData(data));

            res.send(result);
        });
    });
});

router.get('/:name', (req: Request, res: Response) => {
    let { name } = req.params;

    res.send(`Hello, ${name}!`);
});

export const WelcomeController: Router = router;