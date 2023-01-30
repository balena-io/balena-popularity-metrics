import * as express from 'express';
import { metricExporter, metricsMiddleware } from './metrics';
import * as morgan from 'morgan';
import { healthRouter } from './health';
import { popularity } from './popularity';
import { featuredPage } from './featuredPage';

export const app = express();

app.use(metricsMiddleware);
app.use(process.env.NODE_ENV === 'prod' ? morgan('tiny') : morgan('dev'));
app.use(healthRouter);
app.use('/popularity', popularity);
app.use('/featured-page', featuredPage);

const metricsApp = express();
metricsApp.get('/metrics', metricExporter);

const setupAppServer = (
	application: express.Express,
	port: number,
	name: string,
) => {
	application.listen(port, () => {
		console.log(`Server "${name}" started on ${port}`);
	});
};

setupAppServer(app, 3001, 'main');
setupAppServer(metricsApp, 3002, 'metrics');
