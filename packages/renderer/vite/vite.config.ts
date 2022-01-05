import {generateViteConfig} from '@packages/common/src/vite-config';
import {join} from 'path';
import {alwaysReloadPlugin} from './always-reload-plugin';

const viteConfig = generateViteConfig({
    rootDir: join(__dirname, '../'),
    target: 'chrome',
    libraryMode: false,
    plugins: [alwaysReloadPlugin()],
    sourceMap: true,
});

export default viteConfig;
