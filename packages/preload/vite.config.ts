import {builtinModules} from 'module';
import {UserConfig} from 'vite';
import {generateViteConfig} from '../common/vite-config';

const config: UserConfig = generateViteConfig({
    rootDir: __dirname,
    target: 'chrome',
    rollupOptions: {
        external: ['electron', ...builtinModules],
        output: {
            entryFileNames: '[name].cjs',
        },
    },
    sourceMap: 'inline',
});

export default config;
