// @ts-nocheck
import { jest } from '@jest/globals';

global.vi = new Proxy(
	{},
	{
		get(target, property) {
			if (typeof jest[property] === 'function') {
				return jest[property].bind(jest);
			}
			return jest[property];
		},
	},
);
