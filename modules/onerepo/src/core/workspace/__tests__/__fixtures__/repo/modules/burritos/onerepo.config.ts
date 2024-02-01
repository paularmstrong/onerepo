// eslint-disable-next-line import/no-relative-packages
import type { Config } from '../../../../../../../types';

export default {
	commands: {
		passthrough: {
			eat: { description: 'Eat burritos', command: 'eat all --the-things' },
		},
	},
} satisfies Config;
