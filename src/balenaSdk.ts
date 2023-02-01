import { BalenaSDK, getSdk } from 'balena-sdk';

let sdk: BalenaSDK;
export const getBalenaSdk = (): BalenaSDK => {
	if (!sdk) {
		sdk = getSdk();
	}
	return sdk;
};
