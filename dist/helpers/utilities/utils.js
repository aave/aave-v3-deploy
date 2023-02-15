"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsSameMembers = exports.isEqualAddress = exports.filterMapBy = exports.chunk = exports.isValidAddress = void 0;
const constants_1 = require("../constants");
const utils_1 = require("ethers/lib/utils");
const isValidAddress = (value) => !!value && (0, utils_1.isAddress)(value) && (0, utils_1.getAddress)(value) !== (0, utils_1.getAddress)(constants_1.ZERO_ADDRESS);
exports.isValidAddress = isValidAddress;
const chunk = (arr, chunkSize) => {
    return arr.reduce((prevVal, currVal, currIndx, array) => !(currIndx % chunkSize)
        ? prevVal.concat([array.slice(currIndx, currIndx + chunkSize)])
        : prevVal, []);
};
exports.chunk = chunk;
const filterMapBy = (raw, fn) => Object.keys(raw)
    .filter(fn)
    .reduce((obj, key) => {
    obj[key] = raw[key];
    return obj;
}, {});
exports.filterMapBy = filterMapBy;
const isEqualAddress = (a, b) => (0, utils_1.getAddress)(a) === (0, utils_1.getAddress)(b);
exports.isEqualAddress = isEqualAddress;
const containsSameMembers = (arr1, arr2) => {
    return arr1.sort().join(",") === arr2.sort().join(",");
};
exports.containsSameMembers = containsSameMembers;
