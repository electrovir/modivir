import {OpenDialogProperty} from '@packages/common/src/electron-api/electron-types';
import {LibraryWriteResult, validateLibraryWriteResult} from '../data/library-write-result';
import {isValidSong, Song} from '../data/song';
import {isValidUserPreferences, UserPreferences} from '../data/user-preferences';
import {
    createAllowUndefinedValidator,
    createArrayValidator,
    createEnumValidator,
    typeofValidators,
} from './api-validation';
import {ResetType} from './reset';

export const apiRequestKey = 'api-request-key' as const;

export enum ApiRequestType {
    /** Get the current user preferences saved on disk. */
    GetPreferences = 'get-preferences',
    /** Overwrite user preferences */
    SavePreferences = 'save-preferences',
    /** Trigger a native file selection popup. */
    SelectFiles = 'select-files',
    /** Get the directory of the modivir config directory. */
    GetConfigDir = 'get-config-dir',
    /** Open a given file path in the system's default file browser. */
    ViewFilePath = 'view-file-path',
    /**
     * Edit songs already saved into the library or add new songs.
     *
     * Set index to -1 in each new song to add new songs.
     */
    EditSongs = 'edit-songs',
    /** Read the whole library at once! */
    ReadLibrary = 'read-library',
    ResetConfig = 'reset-config',
}

export type ApiRequestData = {
    [ApiRequestType.GetPreferences]: undefined;
    [ApiRequestType.SavePreferences]: UserPreferences;
    [ApiRequestType.SelectFiles]: OpenDialogProperty[] | undefined;
    [ApiRequestType.GetConfigDir]: undefined;
    [ApiRequestType.ViewFilePath]: string;
    [ApiRequestType.EditSongs]: Song[];
    [ApiRequestType.ReadLibrary]: undefined;
    [ApiRequestType.ResetConfig]: ResetType;
};

export type ApiResponseData = {
    [ApiRequestType.GetPreferences]: UserPreferences | undefined;
    [ApiRequestType.SavePreferences]: boolean;
    [ApiRequestType.SelectFiles]: string[] | undefined;
    [ApiRequestType.GetConfigDir]: string;
    [ApiRequestType.ViewFilePath]: void;
    [ApiRequestType.EditSongs]: LibraryWriteResult[];
    [ApiRequestType.ReadLibrary]: Song[] | undefined;
    [ApiRequestType.ResetConfig]: boolean;
};

export const apiValidators: {
    [RequestTypeGeneric in ApiRequestType]: ApiValidationPair<RequestTypeGeneric>;
} = {
    [ApiRequestType.GetPreferences]: {
        request: undefined,
        response: (data): data is UserPreferences | undefined => {
            return data === undefined || isValidUserPreferences(data);
        },
    },
    [ApiRequestType.SavePreferences]: {
        request: isValidUserPreferences,
        response: typeofValidators.boolean,
    },
    [ApiRequestType.SelectFiles]: {
        request: createAllowUndefinedValidator(
            createArrayValidator(createEnumValidator(OpenDialogProperty)),
        ),
        response: createAllowUndefinedValidator(createArrayValidator(typeofValidators.string)),
    },
    [ApiRequestType.GetConfigDir]: {
        request: undefined,
        response: typeofValidators.string,
    },
    [ApiRequestType.ViewFilePath]: {
        request: typeofValidators.string,
        response: undefined,
    },
    [ApiRequestType.EditSongs]: {
        request: createArrayValidator(isValidSong),
        response: createArrayValidator(validateLibraryWriteResult),
    },
    [ApiRequestType.ReadLibrary]: {
        request: undefined,
        response: createArrayValidator(isValidSong),
    },
    [ApiRequestType.ResetConfig]: {
        request: createEnumValidator(ResetType),
        response: typeofValidators.boolean,
    },
};

export type ApiValidator<
    RequestTypeGeneric extends ApiRequestType,
    ResponseOrRequestData extends ApiRequestData | ApiResponseData,
> = (input: any) => input is ResponseOrRequestData[RequestTypeGeneric];

export type ApiValidationPair<RequestTypeGeneric extends ApiRequestType> = {
    request: ApiRequestData[RequestTypeGeneric] extends undefined | void
        ? undefined
        : ApiValidator<RequestTypeGeneric, ApiRequestData>;
    response: ApiResponseData[RequestTypeGeneric] extends undefined | void
        ? undefined
        : ApiValidator<RequestTypeGeneric, ApiResponseData>;
};

export function getGenericApiValidator(
    requestType: ApiRequestType,
): ApiValidationPair<ApiRequestType> {
    const validator = apiValidators[requestType];
    if (!validator) {
        throw new Error(`No validators defined for request type "${requestType}".`);
    }
    return validator;
}
