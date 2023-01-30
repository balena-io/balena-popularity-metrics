export interface Cache<T> {
	get: (k: string) => T | undefined;
	put: (k: string, v: T) => void;
}
