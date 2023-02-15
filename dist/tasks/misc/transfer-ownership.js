"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../helpers/constants");
const hardhat_config_helpers_1 = require("./../../helpers/hardhat-config-helpers");
const tx_1 = require("./../../helpers/utilities/tx");
const contract_getters_1 = require("./../../helpers/contract-getters");
const config_1 = require("hardhat/config");
const utils_1 = require("ethers/lib/utils");
(0, config_1.task)(`transfer-ownership`)
    .addParam("address")
    .addOptionalParam("admin")
    .setAction(async ({ address, admin }, hre) => {
    const network = hardhat_config_helpers_1.FORK || hre.network.name;
    let owner = constants_1.POOL_ADMIN[network];
    if ((0, utils_1.isAddress)(admin)) {
        owner = admin;
    }
    const contract = await (0, contract_getters_1.getOwnableContract)(address);
    const currentOwner = await contract.owner();
    if (currentOwner == owner) {
        console.log(`- Owner of ${address} is already ${owner}`);
    }
    else {
        await (0, tx_1.waitForTx)(await contract.transferOwnership(owner));
        const newOwner = await contract.owner();
        console.log(`- Changed owner from ${currentOwner} to ${newOwner}`);
    }
});
