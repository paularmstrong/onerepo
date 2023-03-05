/**
 * ```sh
 * npm install --save onerepo
 * ```
 *
 * ```sh
 * yarn add onerepo
 * ```
 *
 * @module
 */

export * from '@onerepo/core';
export * from '@onerepo/logger';

export * as graph from '@onerepo/graph';
export * as git from '@onerepo/git';
/**
 * ```ts
 * import { file } from 'onerepo';
 * ```
 */
export * as file from '@onerepo/file';

/**
 * ```ts
 * import { builders } from 'onerepo';
 * ```
 */
export { builders, getters } from '@onerepo/builders';

export * from '@onerepo/subprocess';
export * from '@onerepo/types';
