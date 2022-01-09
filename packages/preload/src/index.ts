import {
    ApiFullResponse,
    ApiRequestDetails,
    ApiRequestFunction,
    apiRequestKey,
} from '@packages/common/src/electron-api/api-request';
import {
    ApiRequestType,
    getGenericApiValidator,
} from '@packages/common/src/electron-api/api-request-type';
import {getApiResponseEventName} from '@packages/common/src/electron-api/api-response';
import {randomString} from 'augment-vir';
import {ipcRenderer} from 'electron';
import {expose} from './expose';

expose({
    versions: process.versions,
    apiRequest: (async (
        details: ApiRequestDetails<ApiRequestType>,
    ): Promise<ApiFullResponse<ApiRequestType>> => {
        async function waitForResponse(): Promise<ApiFullResponse<ApiRequestType>> {
            return new Promise((resolve) => {
                ipcRenderer.once(
                    getApiResponseEventName(details.type, requestId),
                    (event, data) => {
                        resolve(data);
                    },
                );
            });
        }

        const data = 'data' in details ? details.data : undefined;
        const requestId = randomString();

        const responseDataValidator = getGenericApiValidator(details.type).response;

        return new Promise((resolve, reject) => {
            waitForResponse().then((response) => {
                if (response.success) {
                    if (responseDataValidator && !responseDataValidator(response.data)) {
                        console.error(response.data);
                        reject(`Response data validation for ${details.type} failed.`);
                    } else {
                        resolve(response);
                    }
                } else {
                    reject(response.error);
                }
            });
            ipcRenderer.send(apiRequestKey, {type: details.type, data, requestId});
        });
    }) as ApiRequestFunction,
});
