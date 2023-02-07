import { BalenaSDK, getSdk } from 'balena-sdk';
import { getBalenaSdk } from '../src/balenaSdk';

jest.mock('balena-sdk');

const mockGetSdk = jest.mocked(getSdk);

describe('balenaSdk', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.resetModules();
	});

	it('getSdk singleton is called only once', () => {
		mockGetSdk.mockReturnValue({} as BalenaSDK);
		getBalenaSdk();
		getBalenaSdk();
		getBalenaSdk();
		expect(mockGetSdk.mock.calls.length).toBe(1);
	});
});
