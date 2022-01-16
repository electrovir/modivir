import {HasGetPath} from '../augments/electron';
import {initLibrary} from './library/library-init';
import {updateUserPreferences} from './user-preferences';

export async function initConfig(appPaths: HasGetPath): Promise<void> {
    await updateUserPreferences(appPaths);
    await initLibrary(appPaths);
}
