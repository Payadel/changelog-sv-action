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
const core = __importStar(require("@actions/core"));
const inputs_1 = require("./inputs");
const version_1 = require("./version");
const utility_1 = require("./utility");
const output_1 = require("./output");
const run = (package_json_path, changelog_filename) => mainProcess(package_json_path, changelog_filename)
    .then(() => core.info("Operation completed successfully."))
    .catch(error => {
    core.error("Operation failed.");
    core.setFailed(error instanceof Error ? error.message : error.toString());
});
exports.default = run;
function mainProcess(package_json_path, changelog_filename) {
    return (0, inputs_1.getInputs)().then(inputs => {
        return installStandardVersion()
            .then(() => updateVersion(inputs.version, package_json_path, inputs.ignoreSameVersionError, inputs.ignoreLessVersionError))
            .then(() => createChangelog(inputs.version))
            .then(() => (0, output_1.getOutputData)(package_json_path, changelog_filename, inputs.changelogVersionRegex))
            .then(output_1.setOutputs)
            .then(() => updateGitChanges(changelog_filename))
            .then(() => Promise.resolve());
    });
}
function installStandardVersion() {
    return (0, utility_1.execCommand)("npm install -g standard-version", "Install standard-version npm package failed.");
}
function updateVersion(inputVersion, package_json_path, ignoreSameVersionError, ignoreLessVersionError) {
    return new Promise((resolve, reject) => {
        if (!inputVersion)
            return resolve();
        return (0, version_1.readVersion)(package_json_path)
            .then(prevVersion => {
            if (!ignoreSameVersionError &&
                prevVersion.toLowerCase() === inputVersion.toLowerCase()) {
                throw new Error(`The input version '${inputVersion}' is equal to the previously version '${prevVersion}'.\n` +
                    "If you want, you can set ignore-same-version-error to ignore this error.");
            }
            if (!ignoreLessVersionError &&
                (0, version_1.compareVersions)(inputVersion, prevVersion) === -1) {
                throw new Error(`The input version '${inputVersion}' is less than previously version '${prevVersion}'.\n` +
                    "If you want, you can set ignore-less-version-error to ignore this error.");
            }
            core.info(`set version to ${inputVersion}`);
            return (0, utility_1.execCommand)(`standard-version --skip.changelog --skip.tag --skip.commit --release-as ${inputVersion}`, `Update version to requested version (${inputVersion}) failed.`);
        })
            .then(() => resolve())
            .catch(reject);
    });
}
function createChangelog(inputVersion) {
    return new Promise(resolve => {
        let changelogCommand = "standard-version --skip.tag --skip.commit";
        if (inputVersion)
            changelogCommand += " --skip.bump";
        return resolve(changelogCommand);
    }).then(changelogCommand => (0, utility_1.execCommand)(changelogCommand, "Create changelog failed."));
}
function updateGitChanges(changelog_fileName) {
    return (0, utility_1.execCommand)(`git add ${changelog_fileName}`).then(() => (0, utility_1.execCommand)("git checkout ."));
}
//# sourceMappingURL=run.js.map