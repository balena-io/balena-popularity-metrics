import {
	getScoredFleets,
	getScoredApps,
	chooseOnDistribution,
} from '../../src/popularity/score';
import { getActiveApps } from '../../src/popularity/app';
import { getActiveFleets } from '../../src/popularity/fleet';

jest.mock('../../src/popularity/app');
jest.mock('../../src/popularity/fleet');

const mockGetActiveApps = jest.mocked(getActiveApps);
const mockGetActiveFleets = jest.mocked(getActiveFleets);

describe('popularity.score', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return and cache active apps', async () => {
		mockGetActiveApps.mockResolvedValueOnce([
			{
				id: 126,
				should_be_running__release: [
					{
						contract: JSON.stringify({
							description: 'A very long description',
							assets: { logo: { data: { url: 'test' } } },
						}),
					},
				],
			},
			{
				id: 127,
				should_be_running__release: [
					{
						contract: JSON.stringify({
							description: 'Another very long description',
							assets: { logo: { data: { url: 'other-test' } } },
						}),
					},
				],
			},
		]);

		expect(await getScoredApps()).toStrictEqual([
			{
				id: 126,
				score: 0.5,
			},
			{
				id: 127,
				score: 0.5,
			},
		]);

		// cache hit
		await getScoredApps();

		expect(mockGetActiveApps).toHaveBeenCalledTimes(1);
	});

	it('should return and cache active fleets', async () => {
		mockGetActiveFleets.mockResolvedValueOnce([
			{
				id: 126,
				owns__public_device: 3,
				should_be_running__release: [
					{
						contract: JSON.stringify({
							description: 'A very long description',
							assets: { logo: { data: { url: 'test' } } },
						}),
					},
				],
			},
			{
				id: 127,
				owns__public_device: 1,
				should_be_running__release: [
					{
						contract: JSON.stringify({
							description: 'Another very long description',
							assets: { logo: { data: { url: 'other-test' } } },
						}),
					},
				],
			},
		]);

		expect(await getScoredFleets()).toStrictEqual([
			{
				id: 126,
				score: 0.75,
			},
			{
				id: 127,
				score: 0.25,
			},
		]);

		// cache hit
		await getScoredFleets();

		expect(mockGetActiveFleets).toHaveBeenCalledTimes(1);
	});

	it('should choose single if it is the only viable choice', async () => {
		const choice = chooseOnDistribution([{ id: 1, score: 0.3 }]);
		expect(choice).toStrictEqual({ id: 1, score: 0.3 });
	});
});
