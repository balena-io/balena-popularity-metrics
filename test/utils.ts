import { Application } from 'balena-sdk';

export const mockApplicationsGetters = (
	mockedBalenaSdk: jest.MockInstance<any, any>,
	returnValue?: Application | Application[],
) => {
	const mockModelsApplicationGetters = {
		models: {
			application: {
				get: jest.fn().mockReturnValueOnce(returnValue),
				getAll: jest.fn().mockReturnValueOnce(returnValue),
			},
		},
		pine: {
			get: jest.fn().mockReturnValueOnce(returnValue),
		},
	};
	mockedBalenaSdk.mockReturnValueOnce(mockModelsApplicationGetters);
};
