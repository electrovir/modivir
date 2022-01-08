import {TypeofReturnToTypeMapping, TypeofReturnValue} from '../augments/type';
import {isValidUserPreferences, UserPreferences} from '../data/user-preferences';
import {ApiRequestData, ApiRequestType, ApiResponseData} from './api-request';

export function isValidBoolean(input: any): input is boolean {
    return typeof input === 'boolean';
}

export function isValidArray<SpecificType extends TypeofReturnValue>(
    array: any[],
    specificType: SpecificType,
): array is TypeofReturnToTypeMapping[SpecificType][] {
    return array.every((entry) => typeof entry === specificType);
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
        response: (data): data is UserPreferences | undefined => {
            return data === undefined || isValidUserPreferences(data);
        },
    },
    [ApiRequestType.SavePreferences]: {
        request: isValidUserPreferences,
        response: isValidBoolean,
    },
    [ApiRequestType.SelectFiles]: {
        request: undefined,
        response: (data): data is string[] | undefined => {
            return data === undefined || isValidArray(data, 'string');
        },
    },
};

export function getGenericApiValidator(
    requestType: ApiRequestType,
): ApiValidationPair<ApiRequestType> {
    return apiValidators[requestType];
}
