import {ApiRequestDetails} from './api-request';
import {ApiRequestData, ApiRequestType} from './api-request-type';
import {OpenDialogProperty} from './electron-types';

describe('ApiRequestDetails', () => {
    it('should allow undefined when undefined is an option', () => {
        const allowsUndefined = ApiRequestType.SelectFiles;
        const onlyAcceptsUndefined = ApiRequestType.GetPreferences;

        // ensure this type still allows undefined
        const requestDataMaybeUndefined1: ApiRequestData[typeof allowsUndefined] = undefined;
        // ensure this type still allows at least one defined value
        const requestDataMaybeUndefined2: ApiRequestData[typeof allowsUndefined] = [];

        // ensure this type still allows undefined
        const requestDataMustBeUndefined1: ApiRequestData[typeof onlyAcceptsUndefined] = undefined;
        // ensure this type still allows no other types
        // @ts-expect-error
        const requestDataMustBeUndefined2: ApiRequestData[typeof onlyAcceptsUndefined] = [];

        const requestDetailsMaybeUndefined: Omit<
            ApiRequestDetails<typeof allowsUndefined>,
            'requestId'
        > = {
            type: allowsUndefined,
        };

        const requestDetailsMaybeDefined: Omit<
            ApiRequestDetails<typeof allowsUndefined>,
            'requestId'
        > = {
            type: allowsUndefined,
            data: [OpenDialogProperty.multiSelections],
        };

        const requestDetailsMaybeDefinedPoorly: Omit<
            ApiRequestDetails<typeof allowsUndefined>,
            'requestId'
        > = {
            type: allowsUndefined,
            // @ts-expect-error
            data: [5],
        };

        const requestDetailsMustBeUndefined: Omit<
            ApiRequestDetails<typeof onlyAcceptsUndefined>,
            'requestId'
        > = {
            type: onlyAcceptsUndefined,
        };
    });
});
