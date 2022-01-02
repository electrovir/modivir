import {buildMode, packageConfigPaths} from '@packages/common/environment';
import {dirname} from 'path';
import {build} from 'vite';

async function buildAll() {
    const totalTimeLabel = 'Total bundling time';
    console.time(totalTimeLabel);

    for (const packageConfigPath of Object.values(packageConfigPaths)) {
        const consoleGroupName = `${dirname(packageConfigPath)}/`;
        console.group(consoleGroupName);

        const timeLabel = 'Bundling time';
        console.time(timeLabel);

        await build({
            configFile: packageConfigPath,
            mode: buildMode,
        });

        console.timeEnd(timeLabel);
        console.groupEnd();
        console.log('\n'); // Just for pretty print
    }
    console.timeEnd(totalTimeLabel);
}

buildAll().catch((error) => {
    console.error(error);
    process.exit(1);
});
