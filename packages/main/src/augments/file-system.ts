import {ensureDirSync, ensureFileSync, existsSync, lstatSync} from 'fs-extra';

/**
 * Check that a directory exists. If it does not, create the directory. Double check before
 * finishing that the directory was indeed created and is a directory. Will throw an error if the
 * given directory path is actually a file or if the directory wasn't successfully created.
 */
export function checkDir(dirPath: string): void {
    ensureDirSync(dirPath);
    if (!existsSync(dirPath) || !lstatSync(dirPath).isDirectory()) {
        throw new Error(`Failed to create directory at ${dirPath}`);
    }
}

/**
 * Check that a file exists. If it does not, create the file. Double check before finishing that the
 * file was indeed created and is a file (not a directory). Will throw an error if the given file
 * path is actually a directory or if the file wasn't successfully created.
 */
export function checkFile(filePath: string) {
    ensureFileSync(filePath);
    if (!existsSync(filePath) || !lstatSync(filePath).isFile()) {
        throw new Error(`Failed to create file at ${filePath}`);
    }
}
