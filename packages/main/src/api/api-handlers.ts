import {
    ApiRequestData,
    ApiRequestType,
    ApiResponseData,
} from '@packages/common/src/electron-api/api-request-type';
import {App} from 'electron';
import {getConfigDir} from '../config/config-path';
import {readSongs} from '../config/library/library-read';
import {writeSongs} from '../config/library/library-write';
import {readPreferences, savePreferences} from '../config/user-preferences';
import {selectFiles} from './dialogs';
import {viewPath} from './view-file';

export type ApiHandlerFunction<RequestTypeGeneric extends ApiRequestType> = (
    requestInput: ApiRequestData[RequestTypeGeneric],
    electronApp: App,
) => Promise<ApiResponseData[RequestTypeGeneric]> | ApiResponseData[RequestTypeGeneric];

const apiHandlers: {
    [RequestTypeGeneric in ApiRequestType]: ApiHandlerFunction<RequestTypeGeneric>;
} = {
    [ApiRequestType.SavePreferences]: savePreferences,
    [ApiRequestType.GetPreferences]: (input, app) => readPreferences(app),
    [ApiRequestType.SelectFiles]: selectFiles,
    [ApiRequestType.GetConfigDir]: (input, app) => getConfigDir(app),
    [ApiRequestType.ViewFilePath]: (input) => viewPath(input),
    [ApiRequestType.EditSongs]: writeSongs,
    [ApiRequestType.ReadLibrary]: (input, app) => readSongs(app),
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
