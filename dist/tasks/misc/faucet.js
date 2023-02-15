"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const contract_getters_1 = require("../../helpers/contract-getters");
(0, config_1.task)(`transfer-faucet-ownership`, `Transfers ownership of the faucet to relayer`)
    .addParam("owner", "new owners address")
    .setAction(async ({ owner }, hre) => {
    const { deployer } = await hre.getNamedAccounts();
    const faucetContract = await (0, contract_getters_1.getFaucet)();
    console.log(`Faucet contract transferred to new owner ${owner}`);
    const tx = await faucetContract.transferOwnership(owner);
    console.log(`Faucet contract transferred to relayer ${owner}`);
    console.log(`TX ${tx}`);
});
