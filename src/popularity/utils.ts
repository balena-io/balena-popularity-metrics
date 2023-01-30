import { getSdk } from 'balena-sdk';
export const sdk = getSdk();

interface ResourceWithRunningRelease {
	should_be_running__release: Array<{
		contract: string;
	}>;
}
export const hasLogo = (contract: any): boolean => {
	return !!contract.assets?.logo?.data?.url;
};

export const isDisplayable = (
	resource: ResourceWithRunningRelease,
): boolean => {
	const rawContract = resource.should_be_running__release[0].contract;
	if (!rawContract) {
		return false;
	}

	const contract = JSON.parse(rawContract);
	return (
		contract.description && contract.description.length > 7 && hasLogo(contract)
	);
};
