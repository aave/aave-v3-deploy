"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usingTenderly = exports.impersonateAddresses = exports.impersonateAddress = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const impersonateAddress = async (address) => {
    if (!(0, exports.usingTenderly)()) {
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [address],
        });
    }
    const signer = await hre.ethers.provider.getSigner(address);
    return {
        signer,
        address,
    };
};
exports.impersonateAddress = impersonateAddress;
const impersonateAddresses = async (addresses) => bluebird_1.default.map(addresses, exports.impersonateAddress);
exports.impersonateAddresses = impersonateAddresses;
const usingTenderly = () => (hre.network && hre.network.name.includes("tenderly")) ||
    process.env.TENDERLY === "true";
exports.usingTenderly = usingTenderly;
