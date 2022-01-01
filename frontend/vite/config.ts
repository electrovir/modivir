import {join, resolve} from 'path';
import {defineConfig} from 'vite';
import {alwaysReloadPlugin} from './always-reload-plugin';

//
// environment config
//

const isDev = true;
const nodeEnv = isDev ? 'development' : 'production';

//
// vite configuration
//

// See guide on how to configure Vite at: https://vitejs.dev/config/
const viteConfig = defineConfig({
    plugins: [
        alwaysReloadPlugin({
            exclusions: [],
            inclusions: [],
        }),
    ],
    resolve: {
        preserveSymlinks: true,
        alias: {
            /**
             * Allow us to use @frontend/src as a quick path to frontend/src so we can avoid
             * potentially crazy relative imports with lots of "../".
             */
            '@frontend/src': resolve('./src'),
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve('index.html'),
                designSystem: resolve(join('pages', 'design-system-test', 'index.html')),
            },
        },
    },
    server: {
        fs: {
            allow: ['./node_modules', './src'],
        },
        proxy: {},
    },
    // Here we define global constants (global in the scope of index.html)
    define: {
        // 'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    },
    clearScreen: false,
});

export default viteConfig;
