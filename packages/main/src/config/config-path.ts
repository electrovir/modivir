import {AppName} from '@packages/common/src/environment';
import {App} from 'electron';
import {join} from 'path';
import {checkDir} from '../augments/file-system';

/**
 * This is usually just the electron app but since we are ONLY using it in many places just for this
 * one method, might as well not require the entire app.
 */
export type CanGetPath = {
    getPath: App['getPath'];
};

export function getConfigDir(appPaths: CanGetPath): string {
    const configDir = join(appPaths.getPath('userData'), `${AppName}-config`);
    checkDir(configDir);

    return configDir;
}

export function getPreferencesFilePath(appPaths: CanGetPath): string {
    const configDir = getConfigDir(appPaths);

    return join(configDir, 'user-preferences.json');
}
