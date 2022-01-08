import {isValidUserPreferences} from '../data/user-preferences';
import {ApiRequestData, ApiRequestType, ApiResponseData} from './api-request';

export function isValidBoolean(input: any): input is boolean {
    return typeof input === 'boolean';
}

export type ApiValidator<
    RequestTypeGeneric extends ApiRequestType,
    ResponseOrRequestData extends ApiRequestData | ApiResponseData,
> = (input: any) => input is ResponseOrRequestData[RequestTypeGeneric];

export type ApiValidationPair<RequestTypeGeneric extends ApiRequestType> = {
    request: ApiRequestData[RequestTypeGeneric] extends undefined
        ? undefined
        : ApiValidator<RequestTypeGeneric, ApiRequestData>;
    response: ApiResponseData[RequestTypeGeneric] extends undefined
        ? undefined
        : ApiValidator<RequestTypeGeneric, ApiResponseData>;
};

const apiValidators: {
    [RequestTypeGeneric in ApiRequestType]: ApiValidationPair<RequestTypeGeneric>;
} = {
    [ApiRequestType.GetPreferences]: {
        request: undefined,
        response: isValidUserPreferences,
    },
    [ApiRequestType.SavePreferences]: {
        request: isValidUserPreferences,
        response: isValidBoolean,
    },
};

export function getGenericApiValidator(
    requestType: ApiRequestType,
): ApiValidationPair<ApiRequestType> {
    return apiValidators[requestType];
}
