import { getSinglePage } from '../../src/featuredPage/getSinglePage';
import { getBalenaSdk } from '../../src/balenaSdk';
import { Application } from 'balena-sdk';
import { mockApplicationsGetters } from '../utils';

jest.mock('../../src/balenaSdk');

const mockedBalenaSdk = jest.mocked(getBalenaSdk);

describe('featuredPage.getSinglePage', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return empty if no application is found', async () => {
		mockApplicationsGetters(mockedBalenaSdk);
		expect(await getSinglePage(10)).toBeUndefined();
	});

	it('should return formatted page with empty contract', async () => {
		mockApplicationsGetters(mockedBalenaSdk, {
			app_name: 'test-name',
			id: 10,
			is_for__device_type: [{ slug: 'test-device-type' }],
			is_of__class: 'fleet',
			public_organization: [{ name: 'test' }],
			should_be_running__release: [{}],
			slug: 'test/test-name',
		} as Application);

		expect(await getSinglePage(10)).toStrictEqual({
			author: 'test',
			class: 'fleet',
			description: undefined,
			deviceLogos: ['test-device-type'],
			link: 'https://hub.balena.io/organizations/test/fleets/test-name',
			logo: undefined,
			name: 'test-name',
		});
	});

	it('should return formatted page with contract', async () => {
		const contract = JSON.stringify({
			description: 'the contract description',
			data: {
				supportedDeviceTypes: ['1', '2', '3', '4', '5'],
			},
			assets: { logo: { data: { url: 'a-logo-url' } } },
		});

		mockApplicationsGetters(mockedBalenaSdk, {
			app_name: 'test-name',
			id: 11,
			is_for__device_type: [{ slug: 'test-device-type' }],
			is_of__class: 'fleet',
			public_organization: [{ name: 'test' }],
			should_be_running__release: [{ contract }],
			slug: 'test/test-name',
		} as Application);

		expect(await getSinglePage(11)).toStrictEqual({
			author: 'test',
			class: 'fleet',
			description: 'the contract description',
			deviceLogos: ['1', '2', '3', '4'],
			link: 'https://hub.balena.io/organizations/test/fleets/test-name',
			logo: 'a-logo-url',
			name: 'test-name',
		});
	});
});
