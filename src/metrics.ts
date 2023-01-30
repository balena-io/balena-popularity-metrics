import { metrics } from '@balena/node-metrics-gatherer';
import { collectAPIMetrics } from '@balena/node-metrics-gatherer/out/collectors/api/collect';
import { NextFunction, Request, Response } from 'express';

const apiMetrics = collectAPIMetrics(metrics);

export const metricsMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) =>
	apiMetrics(req, res, (err) => {
		(req as any)._metrics_gatherer.labels.queueName = reqPathLabel(req.url);
		next(err);
	});

export const reqPathLabel = (path: string) =>
	(path.startsWith('/') ? path.substring(1) : path)
		.split('/')
		.splice(0, 3)
		.join('_');

export const metricExporter = metrics.requestHandler();
