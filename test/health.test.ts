import { app } from '../src/app';
import * as request from 'supertest';

import { version } from '../package.json';

describe('health.router', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.resetModules();
	});

	it('should get a response from ping', async () => {
		const response = await request(app)
			.get('/ping')
			.expect('Content-Type', /json/)
			.expect(200);
		expect(response.body).toStrictEqual({ version });
	});
});
