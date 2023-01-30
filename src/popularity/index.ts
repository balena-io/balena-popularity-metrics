import { Request, Response, Router } from 'express';
import { getScoredApps, getScoredFleets } from './score';

export const popularity = Router();

popularity.get('/score', async (_req: Request, res: Response) => {
	const fleets = await getScoredFleets();
	const apps = await getScoredApps();
	res.status(200).send({ fleets, apps });
});

popularity.get('/score/fleets', async (_req: Request, res: Response) => {
	const fleets = await getScoredFleets();
	res.status(200).send(fleets);
});

popularity.get('/score/apps', async (_req: Request, res: Response) => {
	const apps = await getScoredApps();
	res.status(200).send(apps);
});
