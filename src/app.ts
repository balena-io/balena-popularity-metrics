import * as express from 'express';
import * as morgan from 'morgan';
import { healthRouter } from './health';
import { popularity } from './popularity';
import { featuredPage } from './featuredPage';

export const app = express();

app.use(morgan('combined'));
app.use(healthRouter);
app.use('/popularity', popularity);
app.use('/featured-page', featuredPage);
