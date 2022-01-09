import {ApiRequestData, ApiRequestType, ApiResponseData} from './api-request-type';

export const apiRequestKey = 'api-request-key' as const;

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
