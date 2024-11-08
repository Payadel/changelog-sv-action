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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readChangelogSection = exports.readFile = exports.execCommand = void 0;
const exec = __importStar(require("@actions/exec"));
const fs_1 = __importDefault(require("fs"));
function execCommand(command, errorMessage = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let output;
        try {
            output = yield exec.getExecOutput(command);
            if (output.exitCode === 0)
                return output;
        }
        catch (error) {
            const title = errorMessage || `Execute '${command}' failed.`;
            const message = error instanceof Error ? error.message : error.toString();
            throw new Error(`${title}\n${message}`);
        }
        throw new Error(`${output.stderr}\n${output.stdout}`);
    });
}
exports.execCommand = execCommand;
function readFile(fileName) {
    return new Promise((resolve, reject) => {
        if (!fs_1.default.existsSync(fileName)) {
            return reject(new Error(`Can not find '${fileName}'.`));
        }
        resolve(fs_1.default.readFileSync(fileName, "utf8").trim());
    });
}
exports.readFile = readFile;
function readChangelogSection(changelog_file, version, pattern) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield readFile(changelog_file);
        const lines = content.split("\n");
        version = version.toLowerCase();
        const headerLines = [];
        for (let i = 0; i < lines.length; i++) {
            if (pattern.test(lines[i]))
                headerLines.push({ line: lines[i], index: i });
        }
        if (headerLines.length === 0) {
            throw new Error("Can not find or detect any changelog header.\n" +
                "You can update regex or report this issue with details.");
        }
        const targetIndex = headerLines.findIndex(line => new RegExp(`\\b${version}\\b`).test(line.line));
        if (targetIndex < 0) {
            throw new Error(`Can not find or detect any changelog with version ${version}.\n` +
                "You can update regex or report this issue with details.");
        }
        const startLineIndex = headerLines[targetIndex].index;
        const endLineIndex = targetIndex + 1 < headerLines.length
            ? headerLines[targetIndex + 1].index
            : lines.length;
        return lines.slice(startLineIndex, endLineIndex).join("\n");
    });
}
exports.readChangelogSection = readChangelogSection;
//# sourceMappingURL=utility.js.map