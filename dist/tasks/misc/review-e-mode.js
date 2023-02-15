"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_ids_1 = require("../../helpers/deploy-ids");
const tx_1 = require("../../helpers/utilities/tx");
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const contract_getters_1 = require("../../helpers/contract-getters");
const config_1 = require("hardhat/config");
const env_1 = require("../../helpers/env");
const hardhat_config_helpers_1 = require("../../helpers/hardhat-config-helpers");
const jsondiffpatch_1 = require("jsondiffpatch");
const chalk_1 = __importDefault(require("chalk"));
const helpers_1 = require("../../helpers");
(0, config_1.task)(`review-e-mode`, ``)
    .addFlag("fix")
    .addParam("id", "ID of EMode Category")
    .setAction(async ({ id, fix }, hre) => {
    const { poolAdmin } = await hre.getNamedAccounts();
    const network = hardhat_config_helpers_1.FORK ? hardhat_config_helpers_1.FORK : hre.network.name;
    const poolConfigurator = (await (0, contract_getters_1.getPoolConfiguratorProxy)(await (0, tx_1.getAddressFromJson)(network, deploy_ids_1.POOL_CONFIGURATOR_PROXY_ID))).connect(await hre.ethers.getSigner(poolAdmin));
    const poolAddressesProvider = await (0, contract_getters_1.getPoolAddressesProvider)(await (0, tx_1.getAddressFromJson)(network, deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID));
    const pool = await (0, contract_getters_1.getPool)(await poolAddressesProvider.getPool());
    const poolConfig = await (0, market_config_helpers_1.loadPoolConfig)(env_1.MARKET_NAME);
    const configEmodeCategory = poolConfig.EModes["StableEMode"];
    const onChainCategory = await pool.getEModeCategoryData(id);
    const expectedCategory = {
        ltv: Number(configEmodeCategory.ltv),
        liquidationThreshold: Number(configEmodeCategory.liquidationThreshold),
        liquidationBonus: Number(configEmodeCategory.liquidationBonus),
        priceSource: configEmodeCategory.oracleId
            ? await (0, market_config_helpers_1.getOracleByAsset)(poolConfig, configEmodeCategory.oracleId)
            : helpers_1.ZERO_ADDRESS,
        label: onChainCategory.label,
    };
    const currentCategory = {
        ltv: onChainCategory.ltv,
        liquidationThreshold: onChainCategory.liquidationThreshold,
        liquidationBonus: onChainCategory.liquidationBonus,
        priceSource: onChainCategory.priceSource,
        label: onChainCategory.label,
    };
    const delta = (0, jsondiffpatch_1.diff)(currentCategory, expectedCategory);
    if (delta) {
        console.log(`- Found ${chalk_1.default.red("differences")} at on chain Emode versus expected "${id}" EMODE from local configuration`);
        console.log(chalk_1.default.red("Current strategy", "=>", chalk_1.default.green("Desired strategy from config")));
        console.log(jsondiffpatch_1.formatters.console.format(delta, expectedCategory));
        if (!fix) {
            // early return
            return;
        }
        await (0, tx_1.waitForTx)(await poolConfigurator.setEModeCategory(id, expectedCategory.ltv, expectedCategory.liquidationThreshold, expectedCategory.liquidationBonus, expectedCategory.priceSource, expectedCategory.label));
        console.log("  - Updated EMode Category");
    }
    else {
        console.log(chalk_1.default.green(`  - Emode ID ${id} matches local Emode configuration`));
    }
});
