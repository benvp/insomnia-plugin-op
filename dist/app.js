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
const op_js_1 = require("@1password/op-js");
const cache = __importStar(require("./cache"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const OP_PLUGIN_CONFIG_KEY = '__op_plugin';
const fetchSecretTemplateTag = {
    name: 'op',
    displayName: '1Password => Fetch Secret',
    liveDisplayName: (args) => {
        var _a, _b;
        return `1Password => ${(_b = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '--'}`;
    },
    description: 'Fetch a secret from your 1Password vault',
    args: [
        {
            displayName: 'Reference',
            description: '1Password item reference (op://...)',
            type: 'string',
            defaultValue: '',
            placeholder: "e.g. 'op://team-name.1password.com/vault-name/item-name'",
        },
    ],
    async run(context, reference) {
        const config = context.context[OP_PLUGIN_CONFIG_KEY];
        await checkCli(config === null || config === void 0 ? void 0 : config.cliPath);
        const entry = await fetchEntry(reference);
        return entry;
    },
};
async function checkCli(cliPath) {
    if (cache.opCliInstalled() !== true) {
        try {
            if (cliPath && !fs_1.default.existsSync(cliPath)) {
                throw new Error(`The file at path ${cliPath} does not exist.`);
            }
            let pathToAdd = cliPath;
            if (cliPath) {
                const stats = fs_1.default.statSync(cliPath);
                if (stats.isFile()) {
                    pathToAdd = path_1.default.dirname(cliPath);
                }
            }
            process.env.PATH = pathToAdd ? `${pathToAdd}:${process.env.PATH}` : process.env.PATH;
            await (0, op_js_1.validateCli)();
            cache.writeOpCliInstalled(true);
        }
        catch (e) {
            const error = new Error(`There was an issue with the 1Password CLI. If you have the op CLI installed using e.g. Homebrew, please set the '__op_plugin.cliPath' environment variable to the directory containing the 'op' binary. (e.g. /opt/homebrew/bin/op). Error details: ${e.message}`);
            error.stack = e.stack;
            throw error;
        }
    }
}
async function fetchEntry(ref) {
    const existing = cache.getEntry(ref);
    if (existing) {
        return existing;
    }
    const entry = op_js_1.read.parse(ref);
    cache.writeEntry(ref, entry);
    return entry;
}
module.exports.templateTags = [fetchSecretTemplateTag];
