import type { WithWorkspaces } from '@onerepo/builders';
import { withWorkspaces } from '@onerepo/builders';
import type { Builder, Handler } from '@onerepo/yargs';
import { verifyDependencies } from './utils/verify-dependencies';

export const command = 'verify';

export const description = 'Verify dependencies across workspaces.';

export const epilogue = `Dependencies across Workspaces can be validated using one of the various modes:

- \`off\`: No validation will occur. Everything goes.
- \`loose\`: Reused third-party dependencies will be required to have semantic version overlap across unique branches of the Graph.
- \`strict\`: Versions of all dependencies across each discrete Workspace dependency tree must be strictly equal.
`;

type Args = WithWorkspaces & {
	mode: 'strict' | 'loose' | 'off';
};

export const builder: Builder<Args> = (yargs) =>
	withWorkspaces(yargs)
		.usage('$0 verify -w [workspaces...]')
		.option('mode', {
			type: 'string',
			choices: ['strict', 'loose', 'off'] as const,
			description:
				'Version selection mode. Use `strict` to use exact version matches, `loose` to accept within defined ranges (`^` or `~` range), and `off` for no verification.',
			default: 'loose' as const,
		})
		.epilogue(epilogue);

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces, graph, logger }) {
	const { mode } = argv;

	if (mode === 'off') {
		logger.info(
			'Dependency verification is currently set to "off". Use `--mode=loose` or `--mode=strict` and try again.',
		);
		return;
	}

	await verifyDependencies(mode, graph, await getWorkspaces(), logger);
};
