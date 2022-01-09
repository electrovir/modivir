import {apiRequestKey} from './api-request';
import {ApiRequestType} from './api-request-type';

export type ApiResponseEventName = `${typeof apiRequestKey}:${ApiRequestType}:${string}`;

export function getApiResponseEventName(
    requestType: ApiRequestType,
    requestId: string,
): ApiResponseEventName {
    return `${apiRequestKey}:${requestType}:${requestId}`;
}
