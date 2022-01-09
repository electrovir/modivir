import {LibraryWriteResult, validateLibraryWriteResult} from '../data/library-write-result';
import {isValidSong, Song} from '../data/song';
import {isValidUserPreferences, UserPreferences} from '../data/user-preferences';
import {createArrayValidator, isValidArray, typeofValidators} from './api-validation';

export enum ApiRequestType {
    GetPreferences = 'get-preferences',
    SavePreferences = 'save-preferences',
    SelectFiles = 'select-files',
    GetConfigDir = 'get-config-dir',
    ViewFilePath = 'view-file-path',
    /** Set index to -1 in each new song to add new songs. */
    EditSongs = 'edit-songs',
    ReadLibrary = 'read-library',
}

export type ApiRequestData = {
    [ApiRequestType.GetPreferences]: undefined;
    [ApiRequestType.SavePreferences]: UserPreferences;
    [ApiRequestType.SelectFiles]: undefined;
    [ApiRequestType.GetConfigDir]: undefined;
    [ApiRequestType.ViewFilePath]: string;
    [ApiRequestType.EditSongs]: Song[];
    [ApiRequestType.ReadLibrary]: undefined;
};

export type ApiResponseData = {
    [ApiRequestType.GetPreferences]: UserPreferences | undefined;
    [ApiRequestType.SavePreferences]: boolean;
    [ApiRequestType.SelectFiles]: string[] | undefined;
    [ApiRequestType.GetConfigDir]: string;
    [ApiRequestType.ViewFilePath]: undefined | void;
    [ApiRequestType.EditSongs]: LibraryWriteResult[];
    [ApiRequestType.ReadLibrary]: Song[];
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
        request: undefined,
        response: (data): data is string[] | undefined => {
            return data === undefined || isValidArray(data, typeofValidators.string);
        },
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
