import { Cache } from './cache';
import * as NodeCache from 'node-cache';

const DEFAULT_TTL = 21600;

export class InMemoryCache<T> implements Cache<T> {
	private cache: NodeCache;
	constructor(ttl = DEFAULT_TTL) {
		this.cache = new NodeCache({ stdTTL: ttl });
	}

	get(k: string): T | undefined {
		return this.cache.get(k);
	}

	put(k: string, v: T): void {
		this.cache.set(k, v);
	}
}
