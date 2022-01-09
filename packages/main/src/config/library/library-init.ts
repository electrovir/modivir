import {join} from 'path';
import {checkFile} from '../../augments/file-system';
import {CanGetPath} from '../config-path';
import {getLibraryDir, songsFile} from './library-files';

export async function initLibrary(appPaths: CanGetPath): Promise<void> {
    const libraryFiles = [songsFile];
    const libraryDir = await getLibraryDir(appPaths);

    libraryFiles.forEach((libraryFile) => {
        const filePath = join(libraryDir, libraryFile);
        checkFile(filePath);
    });
}
