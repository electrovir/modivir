import {
    ApiFullResponse,
    ApiRequestDetails,
    apiRequestKey,
    ApiRequestType,
    getApiResponseEventName,
} from '@packages/common/src/electron-api/api-request';
import {getGenericApiValidator} from '@packages/common/src/electron-api/api-validators';
import {isEnumValue} from 'augment-vir';
import {ipcMain} from 'electron';
import {getGenericApiHandler} from '../api/api-handlers';

export function setupApiHandler() {
    ipcMain.on(apiRequestKey, async (event, requestDetails: ApiRequestDetails<ApiRequestType>) => {
        function sendReply(response: ApiFullResponse<ApiRequestType>) {
            const responseId = getApiResponseEventName(
                requestDetails.type,
                requestDetails.requestId,
            );
            event.reply(responseId, response);
        }

        try {
            const requestType = requestDetails.type;

            if (!isEnumValue(requestType, ApiRequestType)) {
                throw new Error(`Invalid request type "${requestType}"`);
            }

            const requestDataValidator = getGenericApiValidator(requestType).request;

            if (
                // if there is no validator, don't even try calling it
                requestDataValidator &&
                !requestDataValidator(requestDetails.data)
            ) {
                console.error(requestDetails.data);
                throw new Error(`Validation failed for request data.`);
            }

            const handler = getGenericApiHandler(requestType);
            const response = await handler(requestDetails.data);

            sendReply({
                success: true,
                error: undefined,
                data: response,
            });
            return true;
        } catch (error) {
            const errorString = error instanceof Error ? error.message : String(error);

            sendReply({
                success: false,
                error: errorString,
                data: undefined,
            });
            return false;
        }
    });
}
