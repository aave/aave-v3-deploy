"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("./../../helpers/market-config-helpers");
const config_1 = require("hardhat/config");
const tx_1 = require("../../helpers/utilities/tx");
const market_config_helpers_2 = require("../../helpers/market-config-helpers");
const contract_getters_1 = require("../../helpers/contract-getters");
const ethers_1 = require("ethers");
const env_1 = require("../../helpers/env");
(0, config_1.task)(`setup-debt-ceiling`, `Setups reserve debt ceiling from configuration`).setAction(async (_, hre) => {
    const { poolAdmin } = await hre.getNamedAccounts();
    const config = await (0, market_config_helpers_2.loadPoolConfig)(env_1.MARKET_NAME);
    const poolConfigurator = (await (0, contract_getters_1.getPoolConfiguratorProxy)()).connect(await hre.ethers.getSigner(poolAdmin));
    let assetsWithCeiling = [];
    for (let asset in config.ReservesConfig) {
        const debtCeiling = ethers_1.BigNumber.from(config.ReservesConfig[asset].debtCeiling);
        const assetAddress = await (0, market_config_helpers_1.getReserveAddress)(config, asset);
        if (debtCeiling.gt("0")) {
            await (0, tx_1.waitForTx)(await poolConfigurator.setDebtCeiling(assetAddress, debtCeiling));
            console.log("- Updated debt ceiling of", asset, "at", (Number(config.ReservesConfig[asset].debtCeiling) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }));
            assetsWithCeiling.push(asset);
        }
    }
    if (assetsWithCeiling.length) {
        console.log("- Successfully setup debt ceiling:", assetsWithCeiling.join(", "));
    }
    else {
        console.log("- None of the assets has debt ceiling enabled at market configuration");
    }
});
