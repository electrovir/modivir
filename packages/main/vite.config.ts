import {builtinModules} from 'module';
import {UserConfig} from 'vite';
import {generateViteConfig} from '../common/vite-config';

const config: UserConfig = generateViteConfig({
    rootDir: __dirname,
    target: 'node',
    rollupOptions: {
        external: ['electron', 'electron-devtools-installer', ...builtinModules],
        output: {
            entryFileNames: '[name].cjs',
        },
    },
    sourceMap: 'inline',
});

export default config;
