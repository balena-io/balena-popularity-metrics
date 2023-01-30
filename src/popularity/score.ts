import { InMemoryCache } from '../cache/InMemoryCache';
import { App, getActiveApps } from './app';
import { Fleet, getActiveFleets } from './fleet';

export interface PopularityScore
	extends Array<{
		id: number;
		score: number;
	}> {}

const cache = new InMemoryCache<PopularityScore>();

const scoreFleets = (fleets: Fleet[]): PopularityScore => {
	const totalDevices = fleets.reduce(
		(total, fleet) => total + fleet.owns__public_device,
		0,
	);
	const scoredFleet = fleets.map((fleet) => ({
		id: fleet.id,
		score: fleet.owns__public_device / totalDevices,
	}));

	return scoredFleet;
};

const scoreApps = (apps: App[]): PopularityScore => {
	const appScore = 1.0 / apps.length;
	return apps.map((app) => ({
		id: app.id,
		score: appScore,
	}));
};

export const getScoredFleets = async (): Promise<PopularityScore> => {
	let fleets = cache.get('fleets');
	if (!fleets) {
		fleets = scoreFleets(await getActiveFleets());
		cache.put('fleets', fleets);
	}
	return fleets;
};

export const getScoredApps = async (): Promise<PopularityScore> => {
	let fleets = cache.get('apps');
	if (!fleets) {
		fleets = scoreApps(await getActiveApps());
		cache.put('apps', fleets);
	}
	return fleets;
};

export const chooseOnDistribution = (distribution: PopularityScore) => {
	const weights: number[] = [];

	for (let i = 0; i < distribution.length; i++) {
		weights[i] = distribution[i].score + (weights[i - 1] || 0);
	}

	const dieRoll = Math.random() * weights[weights.length - 1];

	for (let i = 0; i < weights.length; i++) {
		if (weights[i] > dieRoll) {
			return distribution[i];
		}
	}

	return distribution[0];
};
