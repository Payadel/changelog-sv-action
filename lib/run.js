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
const utility_1 = require("./utility");
const CHANGELOG_FILE_NAME = "CHANGELOG.md";
const run = () => mainProcess()
    .then(() => core.info("Operation completed successfully."))
    .catch(error => {
    core.error("Operation failed.");
    core.setFailed(error instanceof Error ? error.message : error.toString());
});
exports.default = run;
function mainProcess() {
    return (0, inputs_1.getInputs)().then(inputs => {
        return installStandardVersion()
            .then(() => updateVersion(inputs.version, inputs.ignoreSameVersionError))
            .then(() => createChangelog(inputs.version))
            .then(() => updateGitChanges(CHANGELOG_FILE_NAME))
            .then(() => setOutputs(CHANGELOG_FILE_NAME));
    });
}
function installStandardVersion() {
    return (0, utility_1.execCommand)("npm install -g standard-version", "Install standard-version npm package failed.");
}
function updateVersion(inputVersion, ignoreSameVersionError) {
    return new Promise(() => {
        if (!inputVersion)
            return;
        return Promise.resolve()
            .then(() => {
            if (ignoreSameVersionError)
                return;
            return (0, utility_1.readVersion)("./package.json").then(version => {
                if (version === inputVersion)
                    throw new Error(`The input version '${inputVersion}' is equal to the previously version '${version}'.`);
            });
        })
            .then(() => core.info(`set version to ${inputVersion}`))
            .then(() => (0, utility_1.execCommand)(`standard-version --skip.changelog --skip.tag --skip.commit --release-as ${inputVersion}`, `Update version to requested version (${inputVersion}) failed.`));
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
    return (0, utility_1.execCommand)(`git add ${changelog_fileName}`).then(() => (0, utility_1.execCommand)("git checkout -- package.json package-lock.json"));
}
function setOutputs(changelog_fileName) {
    return (0, utility_1.readVersion)("./package.json")
        .then(version => core.setOutput("version", version))
        .then(() => (0, utility_1.readFile)(changelog_fileName).then(content => core.setOutput("changelog", content)));
}
//# sourceMappingURL=run.js.map