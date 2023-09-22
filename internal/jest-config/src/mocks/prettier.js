// @ts-nocheck
jest.mock('prettier', () => ({
	__esModule: true,
	...jest.requireActual('prettier'),
}));
