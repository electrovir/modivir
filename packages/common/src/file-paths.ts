import {homedir} from 'os';
import {dirname, join} from 'path';
import {AppName, Package} from './environment';

/** This still generates the correct URL when the app is deployed. */
export const repoDir = dirname(dirname(dirname(__dirname)));
export const packagesDir = join(repoDir, 'packages');

const viteFileName = 'vite.config.ts';

export const packageConfigPaths: Record<Package, string> = {
    [Package.Main]: join(packagesDir, Package.Main, viteFileName),
    [Package.Preload]: join(packagesDir, Package.Preload, viteFileName),
    [Package.Renderer]: join(packagesDir, Package.Renderer, 'vite', viteFileName),
};

export const prodPreloadScriptIndex = join(packagesDir, Package.Preload, 'dist', 'index.cjs');

export const libraryConfig = join(homedir(), '.config', AppName);
