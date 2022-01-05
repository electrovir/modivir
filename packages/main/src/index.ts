import {BuildMode, buildMode} from '@packages/common/src/environment';
import {app} from 'electron';
import {checkForUpdates} from './auto-updates';
import {setupIpcCommunication} from './process-communication';
import {setSecurityRestrictions} from './security-restrictions';
import {startupWindow} from './window-management';

async function setupApp(devMode: boolean) {
    const electronApp = app;

    setupIpcCommunication();
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
