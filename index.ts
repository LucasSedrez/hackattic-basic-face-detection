import 'reflect-metadata';
import express from 'express';

import { BasicFaceDetectionController } from './src/controllers';
import { errorHandler } from './error.handler';

const app: express.Application = express();
const port: number = 3000;

app.use('/basic-face-detection', BasicFaceDetectionController);

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}/`);
});