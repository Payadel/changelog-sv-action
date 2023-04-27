const VERSION_REGEX = /\d+(\.\d+){0,3}(-[a-zA-Z0-9]+(\.\d+)*)?/;

export function isVersionValid(version: string): boolean {
    return VERSION_REGEX.test(version);
}
