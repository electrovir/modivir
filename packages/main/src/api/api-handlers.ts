import {
    ApiRequestData,
    ApiRequestType,
    ApiResponseData,
} from '@packages/common/src/electron-api/api-request-type';
import {ModivirApp} from '../augments/electron';
import {getConfigDir} from '../config/config-path';
import {resetConfig} from '../config/config-reset';
import {readSongs} from '../config/library/library-read';
import {writeSongs} from '../config/library/library-write';
import {readUserPreferences, saveUserPreferences} from '../config/user-preferences';
import {selectFiles} from './dialogs';
import {viewPath} from './view-file';

export type ApiHandlerFunction<RequestTypeGeneric extends ApiRequestType> = (
    requestInput: ApiRequestData[RequestTypeGeneric],
    modivirApp: ModivirApp,
) => Promise<ApiResponseData[RequestTypeGeneric]> | ApiResponseData[RequestTypeGeneric];

const apiHandlers: {
    [RequestTypeGeneric in ApiRequestType]: ApiHandlerFunction<RequestTypeGeneric>;
} = {
    [ApiRequestType.SavePreferences]: saveUserPreferences,
    [ApiRequestType.GetPreferences]: (input, app) => readUserPreferences(app),
    [ApiRequestType.SelectFiles]: selectFiles,
    [ApiRequestType.GetConfigDir]: (input, app) => getConfigDir(app),
    [ApiRequestType.ViewFilePath]: (input) => viewPath(input),
    [ApiRequestType.EditSongs]: writeSongs,
    [ApiRequestType.ResetConfig]: resetConfig,
    [ApiRequestType.ReadLibrary]: (input, app) => {
        try {
            return readSongs(app);
        } catch (error) {
            console.error(error);
            return undefined;
        }
    },
};

export function getGenericApiHandler(
    requestType: ApiRequestType,
): ApiHandlerFunction<ApiRequestType> {
    const handler = apiHandlers[requestType];
    if (!handler) {
        throw new Error(`No handler defined for request type "${requestType}"`);
    }
    return handler as ApiHandlerFunction<ApiRequestType>;
}
