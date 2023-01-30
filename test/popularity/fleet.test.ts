import { getActiveFleets } from '../../src/popularity/fleet';
import { getBalenaSdk } from '../../src/balenaSdk';
import { mockApplicationsGetters } from '../utils';
import { Application } from 'balena-sdk';

jest.mock('../../src/balenaSdk');

const mockedBalenaSdk = jest.mocked(getBalenaSdk);

describe('popularity.app.getActiveFleets', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return empty if no active app is found', async () => {
		mockApplicationsGetters(mockedBalenaSdk, []);
		expect(await getActiveFleets()).toStrictEqual([]);
	});

	it('should filter applications without valid contract', async () => {
		mockApplicationsGetters(mockedBalenaSdk, [
			{
				id: 123,
				owns__public_device: 3,
				should_be_running__release: [
					{
						contract: '',
					},
				],
			},
			{
				id: 124,
				owns__public_device: 3,
				should_be_running__release: [
					{
						contract: JSON.stringify({
							description: 'test',
						}),
					},
				],
			},
			{
				id: 125,
				owns__public_device: 3,
				should_be_running__release: [
					{
						contract: JSON.stringify({
							description: 'A very long description',
						}),
					},
				],
			},
			{
				id: 126,
				owns__public_device: 4,
				should_be_running__release: [
					{
						contract: JSON.stringify({
							description: 'A very long description',
							assets: { logo: { data: { url: 'test' } } },
						}),
					},
				],
			},
		] as unknown as Application[]);

		expect(await getActiveFleets()).toStrictEqual([
			{
				id: 126,
				owns__public_device: 4,
				should_be_running__release: [
					{
						contract: JSON.stringify({
							description: 'A very long description',
							assets: { logo: { data: { url: 'test' } } },
						}),
					},
				],
			},
		]);
	});
});
