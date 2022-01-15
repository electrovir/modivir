import {ApiRequestData, ApiRequestType} from './api-request-type';
import {ApiFullResponse} from './api-response';

export type ApiRequestDetails<RequestTypeGeneric extends ApiRequestType> = {
    type: RequestTypeGeneric;
    requestId: string;
} & (Extract<ApiRequestData[RequestTypeGeneric], undefined> extends undefined
    ? {data?: ApiRequestData[RequestTypeGeneric]}
    : {data: ApiRequestData[RequestTypeGeneric]});

export type ApiRequestFunction = <RequestTypeGeneric extends ApiRequestType>(
    details: Omit<
        ApiRequestDetails<RequestTypeGeneric>,
        // requestId is generated within the api request, not by the code making the api request
        'requestId'
    >,
) => Promise<ApiFullResponse<RequestTypeGeneric>>;
