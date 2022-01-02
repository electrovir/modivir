import {dirname, join} from 'path';

export const repoDir = dirname(dirname(__dirname));
export const packagesDir = join(repoDir, 'packages');
