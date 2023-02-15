"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstSigner = exports.getEthersSignersAddresses = exports.getEthersSigners = void 0;
const defender_1 = require("./defender");
const getEthersSigners = async () => {
    const ethersSigners = await hre.ethers.getSigners();
    if ((0, defender_1.usingDefender)()) {
        const [, ...users] = ethersSigners;
        return [await (0, defender_1.getDefenderRelaySigner)(), ...users];
    }
    return ethersSigners;
};
exports.getEthersSigners = getEthersSigners;
const getEthersSignersAddresses = async () => await Promise.all((await (0, exports.getEthersSigners)()).map((signer) => signer.getAddress()));
exports.getEthersSignersAddresses = getEthersSignersAddresses;
const getFirstSigner = async () => (await (0, exports.getEthersSigners)())[0];
exports.getFirstSigner = getFirstSigner;
