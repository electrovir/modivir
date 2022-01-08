import {
    ApiRequestData,
    ApiRequestType,
    ApiResponseData,
} from '@packages/common/src/electron-api/api-request';
import {selectFiles} from './dialogs';
import {readPreferences, savePreferences} from './preferences';

export type ApiHandlerFunction<RequestTypeGeneric extends ApiRequestType> = (
    input: ApiRequestData[RequestTypeGeneric],
) => Promise<ApiResponseData[RequestTypeGeneric]>;

const apiHandlers: {
    [RequestTypeGeneric in ApiRequestType]: ApiHandlerFunction<RequestTypeGeneric>;
} = {
    [ApiRequestType.SavePreferences]: savePreferences,
    [ApiRequestType.GetPreferences]: readPreferences,
    [ApiRequestType.SelectFiles]: selectFiles,
};

export function getGenericApiHandler(
    requestType: ApiRequestType,
): ApiHandlerFunction<ApiRequestType> {
    return apiHandlers[requestType] as ApiHandlerFunction<ApiRequestType>;
}
