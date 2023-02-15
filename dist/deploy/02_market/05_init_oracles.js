"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_ids_1 = require("../../helpers/deploy-ids");
const constants_1 = require("../../helpers/constants");
const tx_1 = require("../../helpers/utilities/tx");
const deploy_ids_2 = require("../../helpers/deploy-ids");
const address_1 = require("@ethersproject/address");
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const env_1 = require("../../helpers/env");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deployer } = await getNamedAccounts();
    const addressesProviderArtifact = await deployments.get(deploy_ids_2.POOL_ADDRESSES_PROVIDER_ID);
    const addressesProviderInstance = (await hre.ethers.getContractAt(addressesProviderArtifact.abi, addressesProviderArtifact.address)).connect(await hre.ethers.getSigner(deployer));
    // 1. Set price oracle
    const configPriceOracle = (await deployments.get(deploy_ids_1.ORACLE_ID)).address;
    const statePriceOracle = await addressesProviderInstance.getPriceOracle();
    if ((0, address_1.getAddress)(configPriceOracle) === (0, address_1.getAddress)(statePriceOracle)) {
        console.log("[addresses-provider] Price oracle already set. Skipping tx.");
    }
    else {
        await (0, tx_1.waitForTx)(await addressesProviderInstance.setPriceOracle(configPriceOracle));
        console.log(`[Deployment] Added PriceOracle ${configPriceOracle} to PoolAddressesProvider`);
    }
    return true;
};
// This script can only be run successfully once per market, core version, and network
func.id = `InitOracles:${env_1.MARKET_NAME}:aave-v3-core@${constants_1.V3_CORE_VERSION}`;
func.tags = ["market", "oracles"];
func.dependencies = ["before-deploy", "core", "periphery-pre", "provider"];
func.skip = async () => (0, market_config_helpers_1.checkRequiredEnvironment)();
exports.default = func;
