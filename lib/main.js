"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const run_1 = __importDefault(require("./run"));
const configs_1 = require("./configs");
(0, run_1.default)(configs_1.PACKAGE_JSON_PATH, configs_1.CHANGELOG_FILE_NAME);
//# sourceMappingURL=main.js.map