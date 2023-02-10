import glob from 'glob';
import path from 'path';
import type {
	BuilderCallback,
	Choices,
	CommandBuilder,
	CommandModule,
	RequireDirectoryOptions,
	Options as YargsOptions,
	PositionalOptions as YargsPositionalOptions,
} from 'yargs';

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

export class Yargs {
	_rootPath: string = process.cwd();
	_commandDirectory: string = process.cwd();
	_filePath = '';
	_onArgv: () => void = () => {};

	#options: Options = {};
	#positionals: Positionals = {};
	#name = '';
	#description: string | false = '';
	#strictCommands = false;
	#strictOptions = false;
	#aliases: Array<string> = [];
	#epilogue: Array<string> = [];
	#commands: Record<string, Yargs> = {};
	#usage: Array<string> = [];
	#examples: Examples = {};

	/**
	 * HACK!
	 * @onerepo/cli patches yargs.commandDir to ensure the commandDir options are always passed through from the root.
	 * This patching _may not_ be correct for consumers outside of onerepo, therefore use at your own risk.
	 */
	_commandDirOpts: RequireDirectoryOptions = {};

	#builder(
		instance: Yargs,
		command: string | Array<string>,
		description: string | false,
		builder: BuilderCallback<unknown, unknown> | CommandBuilder<unknown, unknown>
	) {
		const cmd = Array.isArray(command) ? command.find((cmd) => cmd !== '$0') || this.#name : command;

		instance.#description = description;
		instance.strictCommands(this.#strictCommands);
		instance.strictCommands(this.#strictOptions);
		instance.scriptName(`${this.#name} ${cmd}`);
		instance.#aliases = Array.isArray(command) ? command.filter((command) => command !== cmd) : [];

		// @ts-ignore
		builder(instance);

		this.#commands[cmd] = instance;
	}

	_serialize(name?: string): Docs {
		const filePath = path.relative(this._rootPath, path.join(this._commandDirectory, this._filePath));
		return {
			aliases: this.#aliases,
			command: name || this.#name,
			commands: Object.entries(this.#commands).reduce((memo, [command, instance]) => {
				memo[command] = instance._serialize(command);
				return memo;
			}, {} as Record<string, Docs>),
			description: this.#description,
			epilogue: this.#epilogue,
			examples: this.#examples,
			filePath,
			fullCommand: this.#name,
			options: this.#options,
			positionals: this.#positionals,
			strictCommands: this.#strictCommands,
			strictOptions: this.#strictOptions,
			usage: this.#usage,
		};
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
		return this;
	}

	array(key: string) {
		this.#options[key] = { ...this.#options[key], type: 'array' };
		return this;
	}

	boolean(key: string) {
		this.#options[key] = { ...this.#options[key], type: 'boolean' };
		return this;
	}

	// Irrelevant
	check() {
		return this;
	}

	choices(key: string, choices: Choices) {
		this.#options[key] = { ...this.#options[key], choices };
		return this;
	}

	// Irrelevant
	coerce() {
		return this;
	}

	command(
		command: string | Array<string> | CommandModule,
		description: string | false,
		builder: BuilderCallback<unknown, unknown>
	) {
		const instance = new Yargs();
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
				command.builder || ((yargs) => yargs)
			);
		}
		return this;
	}

	commandDir(pathName: string, opts?: RequireDirectoryOptions) {
		this._commandDirOpts = { ...this._commandDirOpts, ...opts };
		const { recurse = false, extensions = ['js'] } = this._commandDirOpts;
		const baseDir = path.isAbsolute(pathName) ? path.relative(this._rootPath, pathName) : pathName;
		const ext = extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0];
		const files = glob.sync(path.join(baseDir, recurse ? `**/*.${ext}` : `*.${ext}`), { cwd: this._rootPath });

		for (const filepath of files) {
			const { builder, command, description } = require(path.join(this._rootPath, filepath));
			const instance = new Yargs();
			instance.strictCommands(this.#strictCommands);
			instance.strictOptions(this.#strictOptions);
			instance._rootPath = this._rootPath;
			instance._commandDirectory = path.join(this._rootPath, baseDir);
			instance._filePath = path.relative(baseDir, filepath);
			instance._commandDirOpts = this._commandDirOpts;
			this.#builder(instance, command, description, builder);
		}

		return this;
	}

	// Irrelevant
	completion(command?: string, description?: string | false) {
		this.command(command || 'completion', description ?? false, () => {});
		return this;
	}

	// Irrelevant
	config() {
		return this;
	}

	conflicts(x: string, y: string | Array<string>) {
		this.#options[x] = { ...this.#options[x], conflicts: [...(this.#options[x]?.conflicts || []), ...arrayIfy(y)] };
		return this;
	}

	count(key: string) {
		this.#options[key] = { ...this.#options[key], type: 'count' };
		return this;
	}

	default(key: string, value: unknown) {
		this.#options[key] = { ...this.#options[key], default: value };
		return this;
	}

	/**
	 * @deprecated
	 */
	demand() {
		return this;
	}

	demandOption(key: string, reason?: string | boolean) {
		this.#options[key] = { ...this.#options[key], required: Boolean(reason) };
		return this;
	}

	// Irrelevant
	demandCommand() {
		return this;
	}

	deprecateOption(key: string, reason?: string | boolean) {
		this.#options[key] = { ...this.#options[key], deprecated: reason === false ? false : reason || true };
		return this;
	}

	describe(key: string, description: string | false) {
		this.#options[key] = { ...this.#options[key], description };
		return this;
	}

	epilog(message: string) {
		return this.epilogue(message);
	}

	epilogue(message: string) {
		this.#epilogue.push(message);
		return this;
	}

	example(command: string, description: string) {
		this.#examples[command] = description;
		return this;
	}

	global(key: string) {
		this.#options[key] = { ...this.#options[key], global: true };
		return this;
	}

	group(key: string, group: string) {
		this.#options[key] = { ...this.#options[key], group };
		return this;
	}

	hide(key: string) {
		this.#options[key] = { ...this.#options[key], hidden: true };
		return this;
	}

	help(key: string, description: string) {
		this.option(key, {
			description,
			hidden: true,
			type: 'boolean',
		});
		return this;
	}

	implies(x: string, y: string | Array<string>) {
		this.#options[x] = { ...this.#options[x], implied: [...(this.#options[x]?.implied || []), ...arrayIfy(y)] };
		return this;
	}

	// Irrelevant
	middleware() {
		return this;
	}

	nargs(key: string, count: number) {
		this.#options[key] = { ...this.#options[key], nargs: count };
		return this;
	}

	// Irrelevant
	normalize() {
		return this;
	}

	number(key: string) {
		this.#options[key] = { ...this.#options[key], type: 'number' };
		return this;
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
			nargs: option.nargs || 1,
			required: false,
			type: `${option.type}`,
		};

		option.alias && this.alias(key, option.alias);
		option.array && this.array(key);
		option.boolean && this.boolean(key);
		option.conflicts && this.conflicts(key, option.conflicts as Array<string>);
		option.count && this.count(key);
		option.implies && this.implies(key, option.implies as Array<string>);
		option.number && this.number(key);
		option.string && this.string(key);

		// Reset because this takes precedence
		if (option.type) {
			this.#options[key].type = option.type;
		}

		this.demandOption(key, option.demand || option.required || option.require || option.demandOption);
		this.deprecateOption(key, option.deprecate || option.deprecated);

		option.choices && this.choices(key, option.choices);

		return this;
	}

	// TODO
	// options<O extends { [key: string]: YargsOptions }>(options: O) {
	// 	return this;
	// }

	// Irrelevant
	parserConfiguration() {
		return this;
	}

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

		return this;
	}

	// Irrelevant
	recommendCommands() {
		return this;
	}

	scriptName(name: string) {
		this.#name = name;
		return this;
	}

	showHidden(key: string, description?: string) {
		this.option(key, {
			description: description || 'Show hidden arguments.',
			type: 'boolean',
		});
		return this;
	}

	strict(strict = true) {
		this.#strictCommands = strict;
		this.#strictOptions = strict;
		return this;
	}

	strictCommands(strict = true) {
		this.#strictCommands = strict;
		return this;
	}

	strictOptions(strict = true) {
		this.#strictOptions = strict;
		return this;
	}

	string(key: string) {
		this.#options[key] = { ...this.#options[key], type: 'string' };
		return this;
	}

	usage(message: string) {
		const withoutBin = this.#name.replace(/^[\S+]+\s/, '');
		this.#usage.push(message.replace(`$0 ${withoutBin}`, this.#name).replace('$0', this.#name));
		return this;
	}

	// TOOD
	version(name = 'version', description = 'Show this CLI’s version number') {
		this.option(name, { type: 'boolean', description });
		return this;
	}

	// Irrelevant
	wrap() {
		return this;
	}
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
