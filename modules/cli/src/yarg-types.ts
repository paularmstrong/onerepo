import type { getAffected } from './functions/getters';
import type { Argv as Yargv } from 'yargs';
import type { Logger } from '@onerepo/logger';
import type { Repository, Workspace } from '@onerepo/graph';

export interface DefaultArgv {
	ci: boolean;
	'dry-run': boolean;
	silent: boolean;
	verbosity: number;
}

export type HandlerExtra = {
	getAffected: (opts?: Parameters<typeof getAffected>[1]) => ReturnType<typeof getAffected>;
	getFilepaths: () => Promise<Array<string>>;
	getWorkspaces: () => Promise<Array<Workspace>>;
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
