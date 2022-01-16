import {isDevMode} from '@packages/common/src/environment';
import {app} from 'electron';
import {ModivirApp} from './augments/electron';
import {checkForUpdates} from './setup/auto-updates';
import {setSecurityRestrictions} from './setup/security-restrictions';
import {setupApiHandlers} from './setup/setup-api-handlers';
import {startupWindow} from './setup/window-management';

async function setupApp(devMode: boolean) {
    const electronApp = app;
    const modivirApp: ModivirApp = Object.assign(electronApp, {window: undefined});
    /** Disable Hardware Acceleration for power savings */
    electronApp.disableHardwareAcceleration();

    setupApiHandlers(devMode, modivirApp);
    setSecurityRestrictions(modivirApp, devMode);

    await startupWindow(modivirApp, devMode);
    await checkForUpdates(devMode);
}

setupApp(isDevMode).catch((error) => {
    console.error(`Failed to startup app`);
    console.error(error);
    process.exit(1);
});
