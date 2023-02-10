import Module from 'module';
import { Yargs } from './yargs';

const yargsInstance = new Yargs();
function makeSingleton() {
	return yargsInstance;
}

Module.prototype.require = new Proxy(Module.prototype.require, {
	apply(target, thisArg, argumentsList) {
		if (argumentsList[0] === 'yargs') {
			return yargsInstance;
		}
		if (argumentsList[0] === 'yargs/yargs') {
			return makeSingleton;
		}

		return Reflect.apply(target, thisArg, argumentsList);
	},
});

interface Options {
	scriptPath: string;
	rootPath: string;
	commandDirectory: string;
}

export async function generate({ scriptPath, rootPath, commandDirectory }: Options) {
	yargsInstance._rootPath = rootPath;
	yargsInstance._commandDirectory = commandDirectory;
	yargsInstance._onArgv = () => {
		const data = yargsInstance._serialize();

		const out = JSON.stringify(data, null, 2);

		process.stdout.write(out);
	};

	require(scriptPath);
}
