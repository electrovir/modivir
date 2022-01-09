import {join} from 'path';
import {checkFile, writePackedJson} from '../../augments/file-system';
import {CanGetPath} from '../config-path';
import {getLibraryDir, songsFile} from './library-files';

export async function initLibrary(appPaths: CanGetPath): Promise<void> {
    const libraryFiles = [songsFile];
    const libraryDir = await getLibraryDir(appPaths);

    await Promise.all(
        libraryFiles.map(async (libraryFile) => {
            const filePath = join(libraryDir, libraryFile);
            checkFile(filePath);
            await writePackedJson(filePath, []);
        }),
    );
}
