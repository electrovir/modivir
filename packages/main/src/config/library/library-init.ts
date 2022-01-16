import {existsSync} from 'fs';
import {readFile} from 'fs/promises';
import {join} from 'path';
import {HasGetPath} from '../../augments/electron';
import {checkFile, writePackedJson} from '../../augments/file-system';
import {getLibraryDir, songsFile} from './library-files';

export async function initLibrary(appPaths: HasGetPath): Promise<void> {
    const libraryFiles = [
        {
            filePath: songsFile,
            default: [],
        },
    ];
    const libraryDir = await getLibraryDir(appPaths);

    await Promise.all(
        libraryFiles.map(async (libraryFile) => {
            const filePath = join(libraryDir, libraryFile.filePath);
            if (!existsSync(filePath) || !(await readFile(filePath)).toString().trim()) {
                await checkFile(filePath);
                await writePackedJson(filePath, libraryFile.default);
            }
        }),
    );
}
