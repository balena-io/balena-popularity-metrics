import { getActiveApps } from '../../src/popularity/app';
import { getBalenaSdk } from '../../src/balenaSdk';
import { mockApplicationsGetters } from '../utils';
import { Application } from 'balena-sdk';

jest.mock('../../src/balenaSdk');

const mockedBalenaSdk = jest.mocked(getBalenaSdk);

describe('popularity.app.getActiveApps', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return empty if no active app is found', async () => {
		mockApplicationsGetters(mockedBalenaSdk, []);
		expect(await getActiveApps()).toStrictEqual([]);
	});

	it('should filter applications without valid contract', async () => {
		mockApplicationsGetters(mockedBalenaSdk, [
			{
				id: 123,
				should_be_running__release: [
					{
						contract: '',
					},
				],
			},
			{
				id: 124,
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
				should_be_running__release: [
					{
						contract: JSON.stringify({
							description: 'A very long description',
							assets: { logo: { data: { url: 'test' } } },
						}),
					},
				],
			},
		] as Application[]);

		expect(await getActiveApps()).toStrictEqual([
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
		]);
	});
});
