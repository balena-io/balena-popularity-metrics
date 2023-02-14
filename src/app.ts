import * as express from 'express';
import * as morgan from 'morgan';
import { healthRouter } from './health';
import { popularity } from './popularity';
import { featuredPage } from './featuredPage';

export const app = express();

app.use(
	morgan('short', {
		skip: (_req: express.Request, res: express.Response) => {
			return (
				!(process.env.LOG_SUCCESS_RESPONSE === 'true') && res.statusCode < 400
			);
		},
	}),
);

app.use(healthRouter);
app.use('/popularity', popularity);
app.use('/featured-page', featuredPage);
