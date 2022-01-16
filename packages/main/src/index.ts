import {isDevMode} from '@packages/common/src/environment';
import {app} from 'electron';
import {ModivirApp} from './augments/electron';
import {initConfig} from './config/config-init';
import {addAppListeners} from './setup/add-app-listeners';
import {checkForUpdates} from './setup/auto-updates';
import {setupLogging} from './setup/logging';
import {setSecurityRestrictions} from './setup/security-restrictions';
import {setupApiHandlers} from './setup/setup-api-handlers';
import {startupWindow} from './setup/setup-main-window';

async function setupApp(devMode: boolean) {
    const modivirApp: ModivirApp = app;

    setupLogging(modivirApp);

    /** Disable Hardware Acceleration for power savings */
    modivirApp.disableHardwareAcceleration();

    await initConfig(modivirApp);
    await addAppListeners(modivirApp);

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
