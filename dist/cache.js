"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStdTTL = exports.writeOpCliInstalled = exports.opCliInstalled = exports.getEntry = exports.writeEntry = void 0;
var node_cache_1 = __importDefault(require("node-cache"));
var cache = new node_cache_1.default({ stdTTL: 60 * 60 });
function writeEntry(ref, value) {
    return cache.set(ref, value);
}
exports.writeEntry = writeEntry;
function getEntry(ref) {
    return cache.get(ref);
}
exports.getEntry = getEntry;
function opCliInstalled() {
    return cache.get('opCliInstalled');
}
exports.opCliInstalled = opCliInstalled;
function writeOpCliInstalled(installed) {
    return cache.set('opCliInstalled', installed);
}
exports.writeOpCliInstalled = writeOpCliInstalled;
function setStdTTL(ttl) {
    cache.options.stdTTL = ttl;
}
exports.setStdTTL = setStdTTL;
