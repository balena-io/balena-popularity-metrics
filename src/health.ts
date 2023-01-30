import { Router } from 'express';
import { version } from '../package.json';

export const healthRouter = Router();

healthRouter.get('/ping', async (_, res) => res.status(200).json({ version }));
