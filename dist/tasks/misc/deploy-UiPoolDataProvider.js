"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tx_1 = require("./../../helpers/utilities/tx");
const config_1 = require("hardhat/config");
const constants_1 = require("../../helpers/constants");
(0, config_1.task)(`deploy-UiPoolDataProvider`, `Deploys the UiPoolDataProviderV3 contract`).setAction(async (_, hre) => {
    if (!hre.network.config.chainId) {
        throw new Error("INVALID_CHAIN_ID");
    }
    console.log(`\n- UiPoolDataProviderV3 price aggregator: ${constants_1.chainlinkAggregatorProxy[hre.network.name]}`);
    console.log(`\n- UiPoolDataProviderV3 eth/usd price aggregator: ${constants_1.chainlinkEthUsdAggregatorProxy[hre.network.name]}`);
    console.log(`\n- UiPoolDataProviderV3 deployment`);
    const artifact = await (0, tx_1.deployContract)("UiPoolDataProviderV3", [
        constants_1.chainlinkAggregatorProxy[hre.network.name],
        constants_1.chainlinkEthUsdAggregatorProxy[hre.network.name],
    ]);
    console.log("UiPoolDataProviderV3:", artifact.address);
    console.log("Network:", hre.network.name);
});
