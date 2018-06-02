import 'reflect-metadata';
import express from 'express';
import { json } from 'body-parser';

import { WelcomeController } from './src/controllers';

const app: express.Application = express();
const port: number = 3000;

app.use(json());

app.use('/welcome', WelcomeController);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});