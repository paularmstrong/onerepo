// @ts-nocheck
import { jest } from '@jest/globals';

global.vi = new Proxy(
	{},
	{
		get(target, property) {
			return jest[property].bind(jest);
		},
	},
);
