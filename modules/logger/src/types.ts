/**
 * Control the verbosity of the log output
 *
 * | Value  | What           | Description                                      |
 * | ------ | -------------- | ------------------------------------------------ |
 * | `<= 0` | Silent         | No output will be read or written.               |
 * | `>= 1` | Error, Info    |                                                  |
 * | `>= 2` | Warnings       |                                                  |
 * | `>= 3` | Log            |                                                  |
 * | `>= 4` | Debug          | `logger.debug()` will be included                |
 * | `>= 5` | Timing         | Extra performance timing metrics will be written |
 *
 * @group Logger
 */
export type Verbosity = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * @internal
 */
export type LineType = 'start' | 'end' | 'error' | 'warn' | 'info' | 'log' | 'debug' | 'timing';

/**
 * @internal
 */
export type LoggedBuffer = {
	type: LineType;
	contents: string;
	group?: string;
	hasError?: boolean;
	verbosity: Verbosity;
};
