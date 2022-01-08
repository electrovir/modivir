import {BuildMode, buildMode} from '@packages/common/src/environment';
import {app} from 'electron';
import {checkForUpdates} from './setup/auto-updates';
import {setSecurityRestrictions} from './setup/security-restrictions';
import {setupApiHandler} from './setup/setup-api-handler';
import {startupWindow} from './setup/window-management';

async function setupApp(devMode: boolean) {
    const electronApp = app;

    setupApiHandler();
    setSecurityRestrictions(electronApp, devMode);

    /** Disable Hardware Acceleration for power savings */
    electronApp.disableHardwareAcceleration();

    await startupWindow(electronApp, devMode);
    await checkForUpdates(devMode);
}

setupApp(buildMode === BuildMode.Dev).catch((error) => {
    console.error(`Failed to startup app`);
    console.error(error);
    process.exit(1);
});
