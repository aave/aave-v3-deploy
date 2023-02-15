"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const config_1 = require("hardhat/config");
const tx_1 = require("../../helpers/utilities/tx");
const market_config_helpers_2 = require("../../helpers/market-config-helpers");
const contract_getters_1 = require("../../helpers/contract-getters");
const env_1 = require("../../helpers/env");
const helpers_1 = require("../../helpers");
(0, config_1.task)(`setup-e-modes`, `Setups e-modes from config`).setAction(async (_, hre) => {
    const config = await (0, market_config_helpers_2.loadPoolConfig)(env_1.MARKET_NAME);
    const { poolAdmin } = await hre.getNamedAccounts();
    const poolConfigurator = (await (0, contract_getters_1.getPoolConfiguratorProxy)()).connect(await hre.ethers.getSigner(poolAdmin));
    for (let key in config.EModes) {
        const eMode = config.EModes[key];
        let oracle = helpers_1.ZERO_ADDRESS;
        if (eMode.oracleId) {
            oracle = await (0, market_config_helpers_1.getOracleByAsset)(config, eMode.oracleId);
        }
        await (0, tx_1.waitForTx)(await poolConfigurator.setEModeCategory(eMode.id, eMode.ltv, eMode.liquidationThreshold, eMode.liquidationBonus, oracle, eMode.label));
        console.log("- Added E-Mode:");
        console.log("  - Label:", eMode.label);
        console.log("  - Id:", eMode.id);
        console.log("  - LTV:", eMode.ltv);
        console.log("  - LQT:", eMode.liquidationThreshold);
        console.log("  - LQB:", eMode.liquidationBonus);
        console.log("  - Oracle:", eMode.oracleId, "with address", oracle);
        for (let assetIndex in eMode.assets) {
            const asset = eMode.assets[assetIndex];
            const assetAddress = await (0, market_config_helpers_1.getReserveAddress)(config, asset);
            await (0, tx_1.waitForTx)(await poolConfigurator.setAssetEModeCategory(assetAddress, eMode.id));
            console.log("  - Added", asset, "asset to E-Mode", eMode.label);
        }
    }
});
