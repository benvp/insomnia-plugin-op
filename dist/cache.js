"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeEntry = writeEntry;
exports.getEntry = getEntry;
exports.opCliInstalled = opCliInstalled;
exports.writeOpCliInstalled = writeOpCliInstalled;
var node_cache_1 = __importDefault(require("node-cache"));
var cache = new node_cache_1.default({ stdTTL: 60 * 60 });
function writeEntry(ref, value) {
    return cache.set(ref, value);
}
function getEntry(ref) {
    return cache.get(ref);
}
function opCliInstalled() {
    return cache.get('opCliInstalled');
}
function writeOpCliInstalled(installed) {
    return cache.set('opCliInstalled', installed);
}
