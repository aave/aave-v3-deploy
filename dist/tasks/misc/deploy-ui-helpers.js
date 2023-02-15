"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
(0, config_1.task)(`deploy-ui-helpers`, `Deploys all ui helpers`).setAction(async (_, hre) => {
    if (!hre.network.config.chainId) {
        throw new Error("INVALID_CHAIN_ID");
    }
    await hre.run("deploy-UiIncentiveDataProvider");
    await hre.run("deploy-UiPoolDataProvider");
});
