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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.readVersion = exports.execCommand = void 0;
const exec = __importStar(require("@actions/exec"));
const fs_1 = __importDefault(require("fs"));
function execCommand(command, errorMessage = null) {
    return exec
        .getExecOutput(command)
        .then(output => {
        if (output.exitCode === 0)
            return output;
        throw new Error(output.stderr);
    })
        .catch(error => {
        const title = errorMessage || `Execute '${command}' failed.`;
        const message = error instanceof Error ? error.message : error.toString();
        throw new Error(`${title}\n${message}`);
    });
}
exports.execCommand = execCommand;
function readVersion(package_path) {
    return new Promise((resolve, reject) => {
        if (!fs_1.default.existsSync(package_path)) {
            return reject(new Error(`Can not find package.json in '${package_path}'.`));
        }
        return execCommand(`node -p -e "require('${package_path}').version"`, `Read version from '${package_path}' failed.`).then(version => resolve(version.stdout.trim()));
    });
}
exports.readVersion = readVersion;
function readFile(fileName) {
    return new Promise((resolve, reject) => {
        if (!fs_1.default.existsSync(fileName)) {
            return reject(new Error(`Can not find '${fileName}'.`));
        }
        resolve(fs_1.default.readFileSync(fileName, "utf8").trim());
    });
}
exports.readFile = readFile;
//# sourceMappingURL=utility.js.map