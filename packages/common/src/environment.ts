export enum BuildMode {
    Prod = 'production',
    Dev = 'development',
}

function determineBuildMode(): BuildMode {
    const envMode = process.env['MODE'];
    if (envMode === BuildMode.Prod) {
        return envMode;
    } else {
        return BuildMode.Dev;
    }
}

function getBuildMode(): BuildMode {
    const mode = determineBuildMode();
    process.env['MODE'] = mode;
    return mode;
}

export const buildMode = getBuildMode();

export const viteDevServerEnvKey = 'VITE_DEV_SERVER_URL';
export const devServerUrl = process.env[viteDevServerEnvKey]?.replace(/\/$/, '');

export enum Package {
    Main = 'main',
    Preload = 'preload',
    Renderer = 'renderer',
}

export const AppName = 'modivir' as const;
