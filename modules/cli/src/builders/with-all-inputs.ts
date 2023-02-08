import type { DefaultArgv, Yargs } from '../yarg-types';
import type { WithAffected } from './with-affected';
import { withAffected } from './with-affected';
import type { WithFiles } from './with-files';
import { withFiles } from './with-files';
import type { WithWorkspaces } from './with-workspaces';
import { withWorkspaces } from './with-workspaces';

export const withAllInputs = (yargs: Yargs<DefaultArgv>) => withAffected(withFiles(withWorkspaces(yargs)));

export type WithAllInputs = WithAffected & WithFiles & WithWorkspaces;
