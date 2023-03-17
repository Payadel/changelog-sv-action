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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const fs = __importStar(require("fs"));
const CHANGELOG_FILE_NAME = "CHANGELOG.md";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputVersion = core.getInput("version");
        core.info(`Input version: ${inputVersion}`);
        //Install standard-version package
        let execOutput = yield exec.getExecOutput("npm install -g standard-version");
        if (execOutput.exitCode !== 0) {
            core.setFailed(`Install standard-version npm package failed: ${execOutput.stderr}`);
            return;
        }
        // If specific version is requested, update version:
        if (inputVersion) {
            execOutput = yield updateVersion(inputVersion);
            if (execOutput.exitCode !== 0) {
                core.setFailed(`Update version to requested version failed: ${execOutput.stderr}`);
                return;
            }
        }
        let changelogCommand = "standard-version --skip.tag --skip.commit";
        if (inputVersion)
            changelogCommand += " --skip.bump";
        try {
            yield exec
                .getExecOutput(changelogCommand)
                .then(() => exec.getExecOutput(`git add ${CHANGELOG_FILE_NAME}`))
                // The version must not be changed until release.
                .then(() => exec.getExecOutput("git checkout -- package.json"))
                //set output 'version'
                .then(() => getVersion(inputVersion).then(version => core.setOutput("version", version)))
                //set output 'changelog'
                .then(() => core.setOutput("changelog", fs.readFileSync(CHANGELOG_FILE_NAME, "utf8")));
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
function updateVersion(version) {
    return __awaiter(this, void 0, void 0, function* () {
        return exec.getExecOutput(`standard-version --skip.changelog --skip.tag --skip.commit --release-as ${version}`);
    });
}
function getVersion(version) {
    return __awaiter(this, void 0, void 0, function* () {
        if (version)
            return version;
        return yield exec
            .getExecOutput("node -p -e \"require('./package.json').version\"")
            .then(result => result.stdout.trim());
    });
}
main();
//# sourceMappingURL=main.js.map