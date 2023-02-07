import { getScoredFleets, getScoredApps } from '../../src/popularity/score';

import { app } from '../../src/app';
import * as request from 'supertest';

jest.mock('../../src/popularity/score');

const mockGetActiveFleets = jest.mocked(getScoredFleets);
const mockGetActiveApps = jest.mocked(getScoredApps);

describe('popularity.router', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.resetModules();
	});

	it('should get apps and fleets score', async () => {
		mockGetActiveFleets.mockResolvedValueOnce([
			{ id: 1, score: 0.3 },
			{ id: 2, score: 0.7 },
		]);
		mockGetActiveApps.mockResolvedValueOnce([
			{ id: 3, score: 0.5 },
			{ id: 4, score: 0.5 },
		]);

		const response = await request(app)
			.get('/popularity/score')
			.expect('Content-Type', /json/)
			.expect(200);

		expect(response.body).toStrictEqual({
			fleets: [
				{ id: 1, score: 0.3 },
				{ id: 2, score: 0.7 },
			],
			apps: [
				{ id: 3, score: 0.5 },
				{ id: 4, score: 0.5 },
			],
		});
	});

	it('should get fleets scores', async () => {
		mockGetActiveFleets.mockResolvedValueOnce([
			{ id: 1, score: 0.3 },
			{ id: 2, score: 0.7 },
		]);

		const response = await request(app)
			.get('/popularity/score/fleets')
			.expect(200);

		expect(response.body).toStrictEqual([
			{ id: 1, score: 0.3 },
			{ id: 2, score: 0.7 },
		]);
	});

	it('should get apps scores', async () => {
		mockGetActiveApps.mockResolvedValueOnce([
			{ id: 3, score: 0.5 },
			{ id: 4, score: 0.5 },
		]);

		const response = await request(app)
			.get('/popularity/score/apps')
			.expect(200);

		expect(response.body).toStrictEqual([
			{ id: 3, score: 0.5 },
			{ id: 4, score: 0.5 },
		]);
	});
});
