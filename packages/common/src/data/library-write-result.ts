import {matchesShallowObjectSignature} from './object-validator';

export type LibraryWriteResult = ({success: true} | {success: false; error: string}) & {
    filePath: string;
};

const emptyLibraryWriteSuccess: LibraryWriteResult = {success: true, filePath: ''} as const;
const emptyLibraryWriteFailure: LibraryWriteResult = {
    success: false,
    error: '',
    filePath: '',
} as const;

export function validateLibraryWriteResult(input: any): input is LibraryWriteResult {
    return (
        (matchesShallowObjectSignature(input, emptyLibraryWriteSuccess) && input.success) ||
        (matchesShallowObjectSignature(input, emptyLibraryWriteFailure) && !input.success)
    );
}
