import { Cache } from '../../src/cache/cache';
import { InMemoryCache } from '../../src/cache/InMemoryCache';

describe('In memory cache', () => {
	let cache: Cache<number>;
	beforeEach(() => {
		cache = new InMemoryCache<number>(2);
	});

	it('it returns undefined when value not in cache', () => {
		cache.put('key', 2);
		const value = cache.get('other-key');
		expect(value).toBeUndefined();
	});

	it('it retrieves the value from the cache', () => {
		cache.put('key', 2);
		const value = cache.get('key');
		expect(value).toBe(2);
	});

	it('it overwrite older values', () => {
		cache.put('key', 2);
		cache.put('key', 3);
		const value = cache.get('key');
		expect(value).toBe(3);
	});

	it('it expires after defined TTL', async () => {
		cache.put('key', 2);
		await new Promise((resolve) => setTimeout(resolve, 3000));
		const value = cache.get('key');
		expect(value).toBeUndefined();
	});

	it('it should be able to add to cache with default ttl', () => {
		cache = new InMemoryCache<number>();
		cache.put('key', 2);
		const value = cache.get('key');
		expect(value).toBe(2);
	});
});
