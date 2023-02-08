import { getBalenaSdk } from '../balenaSdk';
import { isDisplayable } from './utils';

export interface App {
	id: number;
	should_be_running__release: Array<{
		contract: string;
	}>;
}

export const getActiveApps = async () => {
	const apps = (await getBalenaSdk().models.application.getAll({
		$select: ['id'],
		$filter: {
			is_of__class: 'app',
			is_discoverable: true,
			should_be_running__release: {
				$ne: null,
			},
		},
		$expand: {
			should_be_running__release: {
				$select: ['contract'],
			},
		},
	})) as App[];

	return apps.filter(isDisplayable);
};
