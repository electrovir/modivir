export function extractMessage(error: unknown): string {
    if (error == undefined) {
        return '';
    }
    if (error instanceof Error) {
        return error.message;
    } else {
        return String(error);
    }
}
