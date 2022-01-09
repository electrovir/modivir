import {isDevMode} from '@packages/common/src/environment';
import {app} from 'electron';
import {checkForUpdates} from './setup/auto-updates';
import {setSecurityRestrictions} from './setup/security-restrictions';
import {setupApiHandler} from './setup/setup-api-handler';
import {startupWindow} from './setup/window-management';

async function setupApp(devMode: boolean) {
    const electronApp = app;
    /** Disable Hardware Acceleration for power savings */
    electronApp.disableHardwareAcceleration();

    setupApiHandler(devMode, electronApp);
    setSecurityRestrictions(electronApp, devMode);

    await startupWindow(electronApp, devMode);
    await checkForUpdates(devMode);
}

setupApp(isDevMode).catch((error) => {
    console.error(`Failed to startup app`);
    console.error(error);
    process.exit(1);
});
