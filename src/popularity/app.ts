import { isDisplayable, sdk } from './utils';

export interface App {
	id: number;
	should_be_running__release: Array<{
		contract: string;
	}>;
}

export const getActiveApps = async () => {
	const apps = (await sdk.pine.get({
		resource: 'application',
		options: {
			// @ts-ignore
			$select: ['id'],
			$filter: {
				is_of__class: 'app',
				should_be_running__release: {
					$ne: null,
				},
			},
			$expand: {
				should_be_running__release: {
					$select: ['contract'],
				},
			},
		},
	})) as unknown as App[];

	return apps.filter(isDisplayable);
};
