"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const config_1 = require("hardhat/config");
const tx_1 = require("../../helpers/utilities/tx");
const market_config_helpers_2 = require("../../helpers/market-config-helpers");
const contract_getters_1 = require("../../helpers/contract-getters");
const ethers_1 = require("ethers");
const env_1 = require("../../helpers/env");
(0, config_1.task)(`setup-liquidation-protocol-fee`, `Setups reserve liquidation protocol fee from configuration`).setAction(async (_, hre) => {
    const { poolAdmin } = await hre.getNamedAccounts();
    const config = await (0, market_config_helpers_2.loadPoolConfig)(env_1.MARKET_NAME);
    const poolConfigurator = (await (0, contract_getters_1.getPoolConfiguratorProxy)()).connect(await hre.ethers.getSigner(poolAdmin));
    let assetsWithProtocolFees = [];
    for (let asset in config.ReservesConfig) {
        const liquidationProtocolFee = ethers_1.BigNumber.from(config.ReservesConfig[asset].liquidationProtocolFee);
        const assetAddress = await (0, market_config_helpers_1.getReserveAddress)(config, asset);
        if (liquidationProtocolFee && liquidationProtocolFee.gt("0")) {
            await (0, tx_1.waitForTx)(await poolConfigurator.setLiquidationProtocolFee(assetAddress, liquidationProtocolFee));
            assetsWithProtocolFees.push(asset);
        }
    }
    if (assetsWithProtocolFees.length) {
        console.log("- Successfully setup liquidation protocol fee:", assetsWithProtocolFees.join(", "));
    }
    else {
        console.log("- None of the assets has the liquidation protocol fee enabled at market configuration");
    }
});
