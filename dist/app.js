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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateTags = void 0;
var op_js_1 = require("@1password/op-js");
var cache = __importStar(require("./cache"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var debounceTimer;
var OP_PLUGIN_CONFIG_KEY = '__op_plugin';
var fetchSecretTemplateTag = {
    name: 'op',
    displayName: '1Password => Fetch Secret',
    liveDisplayName: function (args) {
        var _a, _b, _c;
        return "1Password => ".concat((_b = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '--').concat(((_c = args[1]) === null || _c === void 0 ? void 0 : _c.value) ? " (".concat(args[1].value, ")") : '');
    },
    description: 'Fetch a secret from your 1Password vault',
    args: [
        {
            displayName: 'Reference',
            description: '1Password item reference (op://...)',
            type: 'string',
            defaultValue: '',
            placeholder: "e.g. 'op://vault-name/item-name/section/field'",
        },
        {
            displayName: 'Account',
            description: '1Password account name',
            type: 'string',
            defaultValue: '',
            placeholder: "e.g. 'team-name.1password.com'",
        },
    ],
    run: function (context, reference, account) {
        return __awaiter(this, void 0, void 0, function () {
            var config, timeout, livePreviewEnabled;
            return __generator(this, function (_a) {
                config = context.context[OP_PLUGIN_CONFIG_KEY];
                timeout = (config === null || config === void 0 ? void 0 : config.livePreviewFetchDelay) || 500;
                livePreviewEnabled = (config === null || config === void 0 ? void 0 : config.enableLivePreview) !== false;
                if (context.renderPurpose !== 'send' && context.renderPurpose !== 'preview') {
                    return [2, '****'];
                }
                if (context.renderPurpose === 'preview') {
                    if (livePreviewEnabled) {
                        return [2, getDebouncedSecret(config, reference, account, timeout)];
                    }
                    else {
                        return [2, 'No preview available. Set __op_plugin.enableLivePreview to true to enable it.'];
                    }
                }
                return [2, getSecret(config, reference, account)];
            });
        });
    },
};
function checkCli(cliPath) {
    return __awaiter(this, void 0, void 0, function () {
        var pathToAdd, stats, e_1, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(cache.opCliInstalled() !== true)) return [3, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (cliPath && !fs_1.default.existsSync(cliPath)) {
                        throw new Error("The file at path ".concat(cliPath, " does not exist."));
                    }
                    pathToAdd = cliPath;
                    if (cliPath) {
                        stats = fs_1.default.statSync(cliPath);
                        if (stats.isFile()) {
                            pathToAdd = path_1.default.dirname(cliPath);
                        }
                    }
                    process.env.PATH = pathToAdd ? "".concat(pathToAdd, ":").concat(process.env.PATH) : process.env.PATH;
                    return [4, (0, op_js_1.validateCli)()];
                case 2:
                    _a.sent();
                    cache.writeOpCliInstalled(true);
                    return [3, 4];
                case 3:
                    e_1 = _a.sent();
                    error = new Error("There was an issue with the 1Password CLI. If you have the op CLI installed using e.g. Homebrew, please set the '__op_plugin.cliPath' environment variable to the directory containing the 'op' binary. (e.g. /opt/homebrew/bin/op). Error details: ".concat(e_1.message));
                    error.stack = e_1.stack;
                    throw error;
                case 4: return [2];
            }
        });
    });
}
function fetchEntry(ref, account) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, args, entry;
        return __generator(this, function (_a) {
            existing = cache.getEntry(ref);
            if (existing) {
                return [2, existing];
            }
            args = {};
            if (account) {
                args.account = account;
            }
            entry = op_js_1.read.parse(ref, args);
            cache.writeEntry(ref, entry);
            return [2, entry];
        });
    });
}
function getSecret(config, reference, account) {
    return __awaiter(this, void 0, void 0, function () {
        var entry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (config === null || config === void 0 ? void 0 : config.flags) {
                        (0, op_js_1.setGlobalFlags)(config.flags);
                    }
                    if (typeof (config === null || config === void 0 ? void 0 : config.cacheTTL) === 'number') {
                        cache.setStdTTL(config.cacheTTL);
                    }
                    return [4, checkCli(config === null || config === void 0 ? void 0 : config.cliPath)];
                case 1:
                    _a.sent();
                    return [4, fetchEntry(reference, account !== null && account !== void 0 ? account : config === null || config === void 0 ? void 0 : config.defaultAccount)];
                case 2:
                    entry = _a.sent();
                    return [2, entry];
            }
        });
    });
}
function getDebouncedSecret(config, reference, account, timeout) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var secret, error_1, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!reference) {
                            return [2, reject('No reference provided.')];
                        }
                        return [4, getSecret(config, reference, account)];
                    case 1:
                        secret = _a.sent();
                        resolve(secret);
                        return [3, 3];
                    case 2:
                        error_1 = _a.sent();
                        errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                        reject("Error: ".concat(errorMessage));
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); }, timeout);
    });
}
exports.templateTags = [fetchSecretTemplateTag];
