import type { Config } from 'onerepo/src/types';

export default {
	commands: {
		passthrough: {
			eat: { description: 'Eat burritos', command: 'eat all --the-things' },
		},
	},
} satisfies Config;
