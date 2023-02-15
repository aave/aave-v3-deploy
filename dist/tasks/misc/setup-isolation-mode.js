"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const config_1 = require("hardhat/config");
const tx_1 = require("../../helpers/utilities/tx");
const market_config_helpers_2 = require("../../helpers/market-config-helpers");
const contract_getters_1 = require("../../helpers/contract-getters");
const env_1 = require("../../helpers/env");
(0, config_1.task)(`setup-isolation-mode`, `Setup isolation mode from configuration`).setAction(async (_, hre) => {
    const { poolAdmin } = await hre.getNamedAccounts();
    const config = await (0, market_config_helpers_2.loadPoolConfig)(env_1.MARKET_NAME);
    const poolConfigurator = (await (0, contract_getters_1.getPoolConfiguratorProxy)()).connect(await hre.ethers.getSigner(poolAdmin));
    let assetsWithBorrowableIsolationMode = [];
    for (let asset in config.ReservesConfig) {
        const borrowableIsolation = config.ReservesConfig[asset].borrowableIsolation;
        const assetAddress = await (0, market_config_helpers_1.getReserveAddress)(config, asset);
        if (assetAddress && borrowableIsolation) {
            await (0, tx_1.waitForTx)(await poolConfigurator.setBorrowableInIsolation(assetAddress, borrowableIsolation));
            assetsWithBorrowableIsolationMode.push(asset);
        }
    }
    if (assetsWithBorrowableIsolationMode.length) {
        console.log("- Successfully setup isolation mode for:", assetsWithBorrowableIsolationMode.join(", "));
    }
    else {
        console.log("- None of the assets has borrowable isolation enabled at market configuration");
    }
});
