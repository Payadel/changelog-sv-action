// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string

const SEMANTIC_VERSION_REGEX =
    /^(0|[1-9]\d*)(\.\d+){0,2}(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export function isVersionValid(version: string): boolean {
    return SEMANTIC_VERSION_REGEX.test(version);
}
