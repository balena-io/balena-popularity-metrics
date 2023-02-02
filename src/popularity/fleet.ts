import { getBalenaSdk } from '../balenaSdk';
import { isDisplayable } from './utils';

export interface Fleet {
	id: number;
	owns__public_device: number;
	should_be_running__release: Array<{
		contract: string;
	}>;
}

export const getActiveFleets = async () => {
	const orgIdsNotToBePromoted = ['nebraltd'];
	const fleets = (await getBalenaSdk().pine.get({
		resource: 'application',
		options: {
			$select: ['id'],
			$expand: {
				owns__public_device: {
					$count: {
						$filter: {
							was_recently_online: true,
						},
					},
				},
				should_be_running__release: {
					$select: ['contract'],
				},
				public_organization: {
					$select: ['handle'],
				},
			},
			$filter: {
				is_public: true,
				is_of__class: 'fleet' as const,
				should_be_running__release: {
					$ne: null,
				},
				public_organization: {
					$any: {
						$alias: 'po',
						$expr: {
							$not: {
								po: {
									handle: { $in: orgIdsNotToBePromoted },
								},
							},
						},
					},
				},
				owns__public_device: {
					$any: {
						$alias: 'd',
						$expr: {
							d: {
								was_recently_online: true,
							},
						},
					},
				},
			},
			$orderby:
				'owns__public_device/$count($filter=was_recently_online eq 1) desc',
		},
	})) as unknown as Fleet[];

	return fleets.filter(isDisplayable);
};
