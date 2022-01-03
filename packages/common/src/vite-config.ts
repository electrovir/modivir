import * as versions from '@packages/common/src/electron-vendors.cache.json';
import {RollupOptions} from 'rollup';
import {PluginOption, UserConfig} from 'vite';
import {BuildMode, buildMode} from './environment';
import {packagesDir} from './file-paths';

fffffffff;

export type ViteConfigInputs = {
    /**
     * This should be a path to the package directory. Usually just __dirname should be passed in as
     * this argument.
     */
    rootDir: string;
    target: keyof typeof versions;
    sourceMap: boolean | 'inline' | 'hidden';
    rollupOptions?: RollupOptions;
    includeEnvDir?: boolean;
    plugins?: PluginOption[];
};

/** https://vitejs.dev/config */
export function generateViteConfig({
    rootDir,
    target,
    rollupOptions = {},
    includeEnvDir = true,
    plugins = [],
    sourceMap,
}: ViteConfigInputs): UserConfig {
    const envDir = includeEnvDir ? {envDir: process.cwd()} : {};

    return {
        plugins,
        mode: buildMode,
        base: '',
        root: rootDir,
        ...envDir,
        resolve: {
            alias: {
                '@packages': packagesDir,
            },
        },
        build: {
            sourcemap: sourceMap,
            target: `${target}${versions[target]}`,
            outDir: 'dist',
            assetsDir: '.',
            minify: buildMode === BuildMode.Prod,
            lib: {
                entry: 'src/index.ts',
                formats: ['cjs'],
            },
            rollupOptions,
            emptyOutDir: true,
            brotliSize: false,
        },
    };
}
