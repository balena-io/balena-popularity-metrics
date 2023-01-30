import { Request, Response, Router } from 'express';
import {
	chooseOnDistribution,
	getScoredApps,
	getScoredFleets,
} from '../popularity/score';
import { getSinglePage } from './getSinglePage';

export const featuredPage = Router();

featuredPage.get('/', async (req: Request, res: Response) => {
	let resources =
		Math.random() < 0.5 ? await getScoredFleets() : await getScoredApps();
	const excludeIds = (req.query.excludeIds as string | undefined)?.split(',');
	const idsToExclude = new Set(excludeIds);

	resources = resources.filter((r) => !idsToExclude.has(r.id.toString()));
	const toBeShown = chooseOnDistribution(resources);

	res.status(200).send(await getSinglePage(toBeShown.id));
});
