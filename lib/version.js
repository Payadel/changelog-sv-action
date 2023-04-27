"use strict";
// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVersionValid = void 0;
const SEMANTIC_VERSION_REGEX = /^(0|[1-9]\d*)(\.\d+){0,2}(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
function isVersionValid(version) {
    return SEMANTIC_VERSION_REGEX.test(version);
}
exports.isVersionValid = isVersionValid;
//# sourceMappingURL=version.js.map