export type ElectronApi = {
    versions: NodeJS.ProcessVersions;
};

export const electronApiKey = 'electronApi' as const;

interface WindowWithApi extends Window {
    [electronApiKey]: ElectronApi;
}

export function getApi(): ElectronApi {
    if (typeof window === 'undefined') {
        throw new Error('Tried to get electron api from outside of a browser context.');
    } else if (electronApiKey in window) {
        const windowWithApi = window as unknown as WindowWithApi;
        return windowWithApi[electronApiKey] as ElectronApi;
    } else {
        throw new Error(`Could not find "${electronApiKey}" key in window.`);
    }
}
