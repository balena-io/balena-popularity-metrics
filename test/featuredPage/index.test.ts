import {
	chooseOnDistribution,
	getScoredFleets,
} from '../../src/popularity/score';

import { app } from '../../src/app';
import * as request from 'supertest';
import { getSinglePage } from '../../src/featuredPage/getSinglePage';

jest.mock('../../src/popularity/score');
jest.mock('../../src/featuredPage/getSinglePage');

const mockGetActiveFleets = jest.mocked(getScoredFleets);
const mockChooseOnDistribution = jest.mocked(chooseOnDistribution);
// const mockGetActiveApps = jest.mocked(getScoredApps);
const mockGetSinglePage = jest.mocked(getSinglePage);

describe('featuredPage.router', () => {
	const mockPage = {
		author: 'author',
		class: 'fleet',
		description: 'a-fleet',
		deviceLogos: ['logo-device-url'],
		link: 'link',
		logo: 'logo-url',
		name: 'test-name',
	};

	beforeEach(() => {
		jest.resetAllMocks();
		jest.resetModules();
	});

	it('should get one fleet', async () => {
		jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
		mockGetSinglePage.mockResolvedValueOnce(mockPage);
		mockGetActiveFleets.mockResolvedValueOnce([
			{ id: 1, score: 0.5 },
			{ id: 2, score: 0.5 },
		]);
		mockChooseOnDistribution.mockReturnValueOnce({ id: 1, score: 0.5 });
		const response = await request(app).get('/featured-page').expect(200);

		expect(response.body).toStrictEqual(mockPage);
		expect(mockGetSinglePage.mock.calls[0][0]).toBe(1);
		expect(mockChooseOnDistribution.mock.calls[0][0]).toStrictEqual([
			{ id: 1, score: 0.5 },
			{ id: 2, score: 0.5 },
		]);
	});

	it('should get one fleet', async () => {
		jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
		mockGetSinglePage.mockResolvedValueOnce(mockPage);
		mockGetActiveFleets.mockResolvedValueOnce([
			{ id: 1, score: 0.5 },
			{ id: 2, score: 0.5 },
		]);
		mockChooseOnDistribution.mockReturnValueOnce({ id: 1, score: 0.5 });
		const response = await request(app)
			.get('/featured-page')
			.query({ excludeIds: '2' })
			.expect(200);

		expect(response.body).toStrictEqual(mockPage);
		expect(mockGetSinglePage.mock.calls[0][0]).toBe(1);
		expect(mockChooseOnDistribution.mock.calls[0][0]).toStrictEqual([
			{ id: 1, score: 0.5 },
		]);
	});

	// it('should get one app', async () => {
	// 	jest.spyOn(global.Math, 'random').mockReturnValue(0.6);
	// 	mockGetSinglePage.mockResolvedValueOnce(mockPage);
	// 	mockGetActiveApps.mockResolvedValueOnce([
	// 		{ id: 3, score: 0.5 },
	// 		{ id: 4, score: 0.5 },
	// 	]);
	// 	const response = await request(app).get('/featured-page').expect(200);

	// 	expect(response.body).toStrictEqual(mockPage);
	// 	expect(mockGetSinglePage.mock.calls[0][0]).toBe(1);
	// });
});
