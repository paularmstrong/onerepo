import type { Plugin } from '../../types';
import * as Add from './add';
import * as Migrate from './migrate';
import * as Publish from './publish';
import * as Snapshot from './snapshot';
import * as Verify from './verify';
import * as Version from './version';

export const changes: Plugin = function codeowners(config) {
	const command = ['change', 'changes', 'changesets'];
	return {
		yargs: (yargs, visitor) => {
			const add = visitor(Add);
			const migrate = visitor(Migrate);
			const publish = visitor(Publish);
			const snapshot = visitor(Snapshot);
			const verify = visitor(Verify);
			const version = visitor(Version);

			return yargs.command(
				command,
				'Manage changes and changesets for publishable workspaces.',
				(yargs) => {
					const y = yargs
						.usage(`$0 ${command[0]} <command>`)
						.command(
							add.command,
							add.description,
							(yargs) =>
								add
									.builder(yargs)
									.default('filenames', config.changes.filenames)
									.default('prompts', config.changes.prompts),
							add.handler,
						)
						.command(
							migrate.command,
							migrate.description,
							(yargs) => migrate.builder(yargs).default('filenames', config.changes.filenames),
							migrate.handler,
						)
						.command(publish.command, publish.description, publish.builder, publish.handler)
						.command(snapshot.command, snapshot.description, snapshot.builder, snapshot.handler)
						.command(verify.command, verify.description, verify.builder, verify.handler)
						.command(version.command, version.description, version.builder, version.handler)
						.demandCommand(1);

					return y;
				},
				() => {},
			);
		},
	};
};
