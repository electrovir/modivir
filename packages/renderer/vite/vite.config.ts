import {builtinModules} from 'module';
import {join} from 'path';
import type {UserConfig} from 'vite';
import {chrome} from '../../../.electron-vendors.cache.json';
import {alwaysReloadPlugin} from './always-reload-plugin';

const PACKAGE_ROOT = join(__dirname, '../');

const viteConfig: UserConfig = {
    mode: process.env['MODE'] || 'development',
    root: PACKAGE_ROOT,
    resolve: {
        alias: {
            '/@renderer/src/': join(PACKAGE_ROOT, 'src') + '/',
        },
    },
    plugins: [alwaysReloadPlugin()],
    base: '',
    server: {
        fs: {
            strict: true,
        },
    },
    build: {
        sourcemap: true,
        target: `chrome${chrome}`,
        outDir: 'dist',
        assetsDir: '.',
        rollupOptions: {
            external: [...builtinModules],
        },
        emptyOutDir: true,
        brotliSize: false,
    },
    clearScreen: false,
};

export default viteConfig;
