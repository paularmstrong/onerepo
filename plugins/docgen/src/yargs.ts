import path from 'path';
import initJiti from 'jiti';
import { globSync } from 'glob';
import type {
	BuilderCallback,
	Choices,
	CommandBuilder,
	CommandModule,
	RequireDirectoryOptions,
	Options as YargsOptions,
	PositionalOptions as YargsPositionalOptions,
} from 'yargs';
import type { LogStep } from 'onerepo';

type Examples = Record<string, string>;

export interface Positional {
	aliases: Array<string>;
	choices?: Choices;
	conflicts?: Array<string>;
	default?: unknown;
	deprecated: string | boolean;
	description: string | false;
	implied?: Array<string>;
	name: string;
	required: boolean;
	type: string;
}

export type Positionals = Record<string, Positional>;

export interface Option {
	aliases: Array<string>;
	choices?: Choices;
	conflicts?: Array<string>;
	default: unknown;
	deprecated: string | boolean;
	description: string | false;
	global: boolean;
	group: string;
	hidden: boolean;
	implied?: Array<string>;
	name: string;
	nargs: number;
	normalize: boolean;
	required: boolean;
	type: string;
}

export type Options = Record<string, Option>;

export interface Command {
	aliases: Array<string>;
	command: string;
	commands?: Commands;
	description: string | false;
	epilogue?: Array<string>;
	examples: Examples;
	options: Options;
	positionals?: Options;
	strictCommands: boolean;
	strictOptions: boolean;
	usage: Array<string>;
}

type Commands = Record<string, Command>;

export interface Docs {
	aliases: ReadonlyArray<string>;
	command: string;
	commands: Record<string, Docs>;
	description: string | false;
	epilogue: ReadonlyArray<string>;
	examples: Examples;
	filePath: string;
	fullCommand: string;
	options: Options;
	positionals: Positionals;
	strictCommands: boolean;
	strictOptions: boolean;
	usage: Array<string>;
}

const require = initJiti(process.cwd(), { interopDefault: true });

export class Yargs {
	_logger: LogStep;
	_rootPath: string = process.cwd();
	_commandDirectory: string = process.cwd();
	_filePath = '';
	_onArgv: () => void = () => {};

	#options: Options = {};
	#positionals: Positionals = {};
	#name = '';
	_description: string | false = '';
	#strictCommands = false;
	#strictOptions = false;
	_aliases: Array<string> = [];
	#epilogue: Array<string> = [];
	#commands: Record<string, Yargs> = {};
	#usage: Array<string> = [];
	#examples: Examples = {};

	/**
	 * HACK!
	 * onerepo core patches yargs.commandDir to ensure the commandDir options are always passed through from the root.
	 * This patching _may not_ be correct for consumers outside of onerepo, therefore use at your own risk.
	 */
	_commandDirOpts: RequireDirectoryOptions = {};

	#builder(
		instance: Yargs,
		command: string | Array<string>,
		description: string | false,
		builder: BuilderCallback<unknown, unknown> | CommandBuilder<unknown, unknown>,
	) {
		const cmd = Array.isArray(command) ? command.find((cmd) => cmd !== '$0') || this.#name : command;

		instance._description = description;
		instance.strictCommands(this.#strictCommands);
		instance.strictCommands(this.#strictOptions);
		instance.scriptName(`${this.#name} ${cmd}`);
		instance._aliases = Array.isArray(command) ? command.filter((command) => command !== cmd) : [];

		// @ts-ignore
		builder(instance);

		this.#commands[cmd] = instance;
	}

	_serialize(name?: string): Docs {
		const filePath = path.relative(this._rootPath, path.join(this._commandDirectory, this._filePath));
		const commands = Object.entries(this.#commands).reduce(
			(memo, [command, instance]) => {
				memo[command] = instance._serialize(command);
				return memo;
			},
			{} as Record<string, Docs>,
		);
		return {
			aliases: this._aliases,
			command: name || this.#name,
			commands: sorter(commands),
			description: this._description,
			epilogue: this.#epilogue,
			examples: Object.entries(this.#examples).reduce((memo, [example, description]) => {
				memo[replaceBin(example, name ?? this.#name, this._aliases, this.#name)] = description;
				return memo;
			}, {} as Examples),
			filePath,
			fullCommand: this.#name,
			options: sorter(this.#options),
			positionals: sorter(this.#positionals),
			strictCommands: this.#strictCommands,
			strictOptions: this.#strictOptions,
			usage: this.#usage.map((usage) => replaceBin(usage, name ?? this.#name, this._aliases, this.#name)),
		};
	}

	constructor(logger: LogStep) {
		this._logger = logger;
		return new Proxy(this, {
			get(target: Yargs, property: string | symbol, receiver: unknown) {
				if (Reflect.has(target, property)) {
					return function (...args: Array<unknown>) {
						const ret = Reflect.get(target, property).bind(target)(...args);
						return typeof ret === 'undefined' ? receiver : ret;
					};
				}

				return function unimplemented() {
					target._logger.warn(`Unimplemented yargs function "${String(property)}" will be ignored.`);
					return receiver;
				}.bind(target);
			},
		});
	}

	get argv() {
		this._onArgv();
		return { _: [] };
	}

	alias(longName: string | ReadonlyArray<string>, shortName: string | ReadonlyArray<string>) {
		arrayIfy(longName).forEach((longName) => {
			this.#options[longName] = {
				...this.#options[longName],
				aliases: [...(this.#options[longName]?.aliases || []), ...arrayIfy(shortName)],
			};
		});
	}

	array(key: string) {
		this.#options[key] = { ...this.#options[key], type: 'array' };
	}

	boolean(key: string) {
		this.#options[key] = { ...this.#options[key], type: 'boolean' };
	}

	check() {}

	choices(key: string, choices: Choices) {
		this.#options[key] = { ...this.#options[key], choices };
	}

	coerce() {}

	command(
		command: string | Array<string> | CommandModule,
		description: string | false,
		builder: BuilderCallback<unknown, unknown>,
	) {
		const instance = new Yargs(this._logger);
		instance._rootPath = this._rootPath;
		instance._commandDirOpts = this._commandDirOpts;
		instance.strictCommands(this.#strictCommands);
		instance.strictOptions(this.#strictOptions);

		if (Array.isArray(command) || typeof command === 'string') {
			this.#builder(instance, command, description, builder);
		} else {
			this.#builder(
				instance,
				[...arrayIfy(command.command!), ...arrayIfy(command.aliases!)],
				// @ts-ignore description was deprecated and removed from types
				command.description || command.describe,
				command.builder || ((yargs) => yargs),
			);
		}
	}

	commandDir(pathName: string, opts?: RequireDirectoryOptions) {
		this._commandDirOpts = { ...this._commandDirOpts, ...opts };

		const { recurse = false, extensions = ['js'] } = this._commandDirOpts;
		const baseDir = path.isAbsolute(pathName) ? path.relative(this._rootPath, pathName) : pathName;
		const ext = extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0];
		const files = globSync(path.join(baseDir, recurse ? `**/*.${ext}` : `*.${ext}`), {
			cwd: this._rootPath,
		});

		const { exclude = () => false } = this._commandDirOpts;

		for (const filepath of files) {
			if (exclude instanceof RegExp && exclude.test(filepath)) {
				continue;
			}
			if (typeof exclude === 'function' && exclude(filepath)) {
				continue;
			}

			const { builder, command, description } = require(path.join(this._rootPath, filepath));
			const instance = new Yargs(this._logger);
			instance.strictCommands(this.#strictCommands);
			instance.strictOptions(this.#strictOptions);
			instance._rootPath = this._rootPath;
			instance._commandDirectory = path.join(this._rootPath, baseDir);
			instance._filePath = path.relative(baseDir, filepath);
			instance._commandDirOpts = this._commandDirOpts;
			this.#builder(instance, command, description, builder);
		}
	}

	completion(command?: string, description?: string | false) {
		this.command(command || 'completion', description ?? false, () => {});
	}

	config() {}

	conflicts(x: string, y: string | Array<string>) {
		this.#options[x] = { ...this.#options[x], conflicts: [...(this.#options[x]?.conflicts || []), ...arrayIfy(y)] };
	}

	count(key: string) {
		this.#options[key] = { ...this.#options[key], type: 'count' };
	}

	default(key: string, value: unknown) {
		if (key in this.#options && value !== undefined) {
			const normalized = this.#options[key].normalize ? path.relative(this._filePath, value as string) : value;
			this.#options[key] = { ...this.#options[key], default: normalized };
		}
	}

	/**
	 * @deprecated
	 */
	demand() {}

	demandOption(key: string, reason?: string | boolean) {
		this.#options[key] = { ...this.#options[key], required: Boolean(reason) };
	}

	demandCommand() {}

	deprecateOption(key: string, reason?: string | boolean) {
		this.#options[key] = { ...this.#options[key], deprecated: reason === false ? false : reason || true };
	}

	describe(key: string, description: string | false) {
		this.#options[key] = { ...this.#options[key], description };
	}

	epilog(message: string) {
		return this.epilogue(message);
	}

	epilogue(message: string) {
		this.#epilogue.push(message);
	}

	example(command: string, description: string) {
		this.#examples[command] = description;
	}

	global(key: string) {
		this.#options[key] = { ...this.#options[key], global: true };
	}

	group(key: string, group: string) {
		this.#options[key] = { ...this.#options[key], group };
	}

	hide(key: string) {
		if (key in this.#options) {
			this.#options[key] = { ...this.#options[key], hidden: true };
		}
	}

	help(key: string, description: string) {
		this.option(key, {
			description,
			hidden: true,
			type: 'boolean',
		});
	}

	implies(x: string, y: string | Array<string>) {
		this.#options[x] = { ...this.#options[x], implied: [...(this.#options[x]?.implied || []), ...arrayIfy(y)] };
	}

	// no-op
	middleware() {}

	nargs(key: string, count: number) {
		this.#options[key] = { ...this.#options[key], nargs: count };
	}

	normalize(key: string) {
		this.#options[key] = { ...this.#options[key], normalize: true };
		this.default(key, this.#options[key].default);
	}

	number(key: string) {
		this.#options[key] = { ...this.#options[key], type: 'number' };
	}

	option(key: string, option: YargsOptions) {
		this.#options[key] = {
			aliases: [],
			default: option.default,
			deprecated: false,
			description: option.description ?? option.describe ?? '',
			global: Boolean(option.global),
			group: option.group || '',
			hidden: Boolean(option.hidden),
			name: key,
			normalize: option.normalize ?? false,
			nargs: option.nargs || 1,
			required: false,
			type: `${option.type}`,
		};

		/* eslint-disable @typescript-eslint/no-unused-expressions */
		option.alias && this.alias(key, option.alias);
		option.array && this.array(key);
		option.boolean && this.boolean(key);
		option.conflicts && this.conflicts(key, option.conflicts as Array<string>);
		option.count && this.count(key);
		option.implies && this.implies(key, option.implies as Array<string>);
		option.number && this.number(key);
		option.string && this.string(key);

		option.normalize && option.default && this.default(key, option.default);
		/* eslint-enable @typescript-eslint/no-unused-expressions */

		// Reset because this takes precedence
		if (option.type) {
			this.#options[key].type = option.type;
		}

		this.demandOption(key, option.demand || option.required || option.require || option.demandOption);
		this.deprecateOption(key, option.deprecate || option.deprecated);

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		option.choices && this.choices(key, option.choices);
	}

	// TODO
	// options<O extends { [key: string]: YargsOptions }>(options: O) {
	//
	// }

	parserConfiguration() {}

	positional(name: string, positional: YargsPositionalOptions) {
		this.#positionals[name] = {
			aliases: [...(this.#positionals[name]?.aliases || []), ...arrayIfy(positional.alias!)],
			choices: positional.choices || undefined,
			// TODO: conflicts
			default: positional.default,
			deprecated: 'deprecated' in positional ? (positional.deprecated as string | boolean) : false,
			description: positional.description ?? positional.describe ?? positional.desc ?? '',
			// TODO: implies
			name,
			// @ts-ignore some deprecated variants have been omitted
			required: positional.demand || positional.required || positional.require || positional.demandOption,
			type: positional.array ? 'array' : `${positional.type}`,
		};
	}

	scriptName(name: string) {
		this.#name = name;
	}

	showHidden(key: string, description?: string) {
		this.option(key, {
			description: description || 'Show hidden arguments.',
			type: 'boolean',
			hidden: true,
		});
	}

	strict(strict = true) {
		this.#strictCommands = strict;
		this.#strictOptions = strict;
	}

	strictCommands(strict = true) {
		this.#strictCommands = strict;
	}

	strictOptions(strict = true) {
		this.#strictOptions = strict;
	}

	string(key: string) {
		this.#options[key] = { ...this.#options[key], type: 'string' };
	}

	usage(message: string) {
		this.#usage.push(message);
	}

	version(name: string | false = 'version', description = 'Show this CLI’s version number') {
		if (!name) {
			return;
		}
		this.option('version', { type: 'boolean', description });
	}

	wrap() {}
}

function arrayIfy<T extends string | number | boolean | undefined>(value: T | Array<T> | ReadonlyArray<T>): Array<T> {
	if (!value) {
		return [];
	}
	if (Array.isArray(value)) {
		return value;
	}
	return [value as T];
}

function sorter<T>(options: Record<string, T>) {
	const sortedKeys = Object.keys(options).sort((a, b) => {
		return a.localeCompare(b);
	});

	const sorted: Record<string, T> = {};
	for (const key of sortedKeys) {
		sorted[key] = options[key];
	}
	return sorted;
}

function replaceBin(str: string, name: string, aliases: Array<string>, fullCommand: string) {
	return str.replace(new RegExp(`\\$0 (?:(?:${name}|${aliases.join('|')}) ?)+`, 'g'), `${fullCommand} `);
}
