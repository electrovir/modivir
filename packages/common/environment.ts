import {join} from 'path';
import {packagesDir} from './file-paths';

export enum BuildMode {
    Prod = 'production',
    Dev = 'development',
}

function determineBuildMode(): BuildMode {
    const envMode = process.env['MODE'];
    if (envMode === BuildMode.Prod) {
        return envMode;
    } else {
        return BuildMode.Dev;
    }
}

function getBuildMode(): BuildMode {
    const mode = determineBuildMode();
    process.env['MODE'] = mode;
    return mode;
}

export const buildMode = getBuildMode();

export enum Package {
    Main = 'main',
    Preload = 'preload',
    Renderer = 'renderer',
}

const viteFileName = 'vite.config.ts';

export const packageConfigPaths: Record<Package, string> = {
    [Package.Main]: join(packagesDir, Package.Main, viteFileName),
    [Package.Preload]: join(packagesDir, Package.Preload, viteFileName),
    [Package.Renderer]: join(packagesDir, Package.Renderer, 'vite', viteFileName),
};
