import { InMemoryCache } from '../cache/InMemoryCache';
import { Application } from 'balena-sdk';
import { getBalenaSdk } from '../balenaSdk';

export interface FeaturedPage {
	author: string;
	class: string;
	description: string;
	deviceLogos: string[];
	link: string;
	logo: string | undefined;
	name: string;
}

const SHOWN_DEVICE_COUNT = 4;
const FEATURED_PAGE_CACHE_TTL = 3600;

const featuredPageCache = new InMemoryCache<FeaturedPage>(
	FEATURED_PAGE_CACHE_TTL,
);

const formatPageContent = (resource: Application): FeaturedPage => {
	const rawContract = (resource.should_be_running__release as any)[0].contract;
	const contract = rawContract ? JSON.parse(rawContract) : {};
	const defaultDeviceType = (resource.is_for__device_type as any)[0].slug;
	const deviceTypes = contract.data?.supportedDeviceTypes ?? [
		defaultDeviceType,
	];
	const authorSlug = resource.slug.split('/')[0];

	const author = (resource.public_organization as any)[0].name;
	const appClass = resource.is_of__class;
	const description = contract.description;
	const deviceLogos = deviceTypes.slice(0, SHOWN_DEVICE_COUNT);
	const name = resource.app_name;
	const link =
		'https://hub.balena.io/organizations/' +
		authorSlug +
		'/' +
		resource.is_of__class +
		's/' +
		name;
	const logo = contract.assets?.logo?.data?.url;

	return {
		author,
		class: appClass,
		description,
		deviceLogos,
		link,
		logo,
		name,
	};
};

const fetchPageContent = async (
	id: number,
): Promise<FeaturedPage | undefined> => {
	try {
		const resource = await getBalenaSdk().models.application.get(id, {
			$select: ['app_name', 'id', 'slug', 'is_of__class'],
			$expand: {
				public_organization: { $select: ['name'] },
				is_for__device_type: {
					$select: ['slug'],
				},
				should_be_running__release: {
					$select: ['contract'],
				},
			},
		});

		return formatPageContent(resource);
	} catch (e) {
		console.error(`Failed to fetch application with id ${id}`, e);
	}
};

export const getSinglePage = async (
	id: number,
): Promise<FeaturedPage | undefined> => {
	let page = featuredPageCache.get(id.toString());
	if (!page) {
		page = await fetchPageContent(id);
		if (page) {
			featuredPageCache.put(id.toString(), page);
		}
	}
	return page;
};
