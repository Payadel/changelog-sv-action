"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputs = void 0;
const core = __importStar(require("@actions/core"));
const version_1 = require("./version");
const core_1 = require("@actions/core");
const configs_1 = require("./configs");
const getInputs = () => new Promise((resolve, reject) => {
    const version = getInputOrDefault("version", "", true, false);
    if (version && !(0, version_1.isVersionValid)(version))
        return reject(new Error("The input version is not valid."));
    const ignoreSameVersionError = (0, core_1.getBooleanInput)("ignore-same-version-error");
    const ignoreLessVersionError = (0, core_1.getBooleanInput)("ignore-less-version-error");
    const changelogVersionRegexStr = getInputOrDefault("changelog-version-regex", configs_1.DEFAULT_CHANGELOG_VERSION_REGEX, true, false);
    const changelogVersionRegex = new RegExp(changelogVersionRegexStr);
    return resolve({
        version,
        ignoreSameVersionError,
        ignoreLessVersionError,
        changelogVersionRegex
    });
});
exports.getInputs = getInputs;
function getInputOrDefault(name, default_value = "", trimWhitespace = false, required = false) {
    const input = core.getInput(name, {
        trimWhitespace,
        required
    });
    if (!input || input === "")
        return default_value;
    return input;
}
//# sourceMappingURL=inputs.js.map