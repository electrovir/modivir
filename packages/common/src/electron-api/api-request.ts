import {UserPreferences} from '../data/user-preferences';

export const apiRequestKey = 'api-request-key' as const;

export enum ApiRequestType {
    GetPreferences = 'get-preferences',
    SavePreferences = 'save-preferences',
}

export type ApiResponseEventName = `${typeof apiRequestKey}:${ApiRequestType}:${string}`;

export function getApiResponseEventName(
    requestType: ApiRequestType,
    requestId: string,
): ApiResponseEventName {
    return `${apiRequestKey}:${requestType}:${requestId}`;
}

export type ApiRequestData = {
    [ApiRequestType.GetPreferences]: undefined;
    [ApiRequestType.SavePreferences]: UserPreferences;
};

export type ApiResponseData = {
    [ApiRequestType.GetPreferences]: UserPreferences | undefined;
    [ApiRequestType.SavePreferences]: boolean;
};

export type ApiRequestDetails<RequestTypeGeneric extends ApiRequestType> = {
    type: RequestTypeGeneric;
    requestId: string;
} & (ApiRequestData[RequestTypeGeneric] extends undefined
    ? {data?: undefined}
    : {data: ApiRequestData[RequestTypeGeneric]});

export type ApiFullResponse<RequestTypeGeneric extends ApiRequestType> =
    | {
          success: true;
          error: undefined;
          data: ApiResponseData[RequestTypeGeneric];
      }
    | {
          success: false;
          error: string;
          data: undefined;
      };

export type ApiRequestFunction = <RequestTypeGeneric extends ApiRequestType>(
    details: Omit<
        ApiRequestDetails<RequestTypeGeneric>,
        // requestId is generated within the api request, not by the code making the api request
        'requestId'
    >,
) => Promise<ApiFullResponse<RequestTypeGeneric>>;
