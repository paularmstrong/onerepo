declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			ONE_REPO_ROOT: string;
			ONE_REPO_DRY_RUN: string;
			ONE_REPO_CI: string;
			ONE_REPO_VERBOSITY: string;
			ONE_REPO_HEAD_BRANCH: string;
		}
	}
}

import type { Argv as Yargv } from 'yargs';
import type { Logger, Step } from '@onerepo/logger';
import type { Repository, Workspace } from '@onerepo/graph';

export interface DefaultArgv {
	ci: boolean;
	'dry-run': boolean;
	silent: boolean;
	verbosity: number;
}

export type GetterOptions = {
	from?: string;
	ignore?: Array<string>;
	through?: string;
	step?: Step;
};

export type HandlerExtra = {
	getAffected: (opts?: GetterOptions) => Promise<Array<Workspace>>;
	getFilepaths: (opts?: GetterOptions) => Promise<Array<string>>;
	getWorkspaces: (opts?: GetterOptions) => Promise<Array<Workspace>>;
	graph: Repository;
	logger: Logger;
};

// Reimplementation of this type from Yargs because we do not allow unknowns, nor camelCase
export type Arguments<T = object> = { [key in keyof T as key]: T[key] } & {
	/** Non-option arguments */
	_: Array<string | number>;
	/** The script name or node command */
	$0: string;
	/** Any content that comes after " -- " gets populated here */
	'--': Array<string>;
};

export type Yargs<T = DefaultArgv> = Yargv<T>;
export type Argv<T = object> = Arguments<T & DefaultArgv>;
// export type Builder<T = object> = CommandBuilder<Argv<DefaultArgv>, T>;
export type Builder<U = object> = (argv: Yargs) => Yargv<U>;
export type Handler<T = object> = (argv: Argv<T>, extra: HandlerExtra) => Promise<void>;
