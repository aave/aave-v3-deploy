"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const env_1 = require("../../helpers/env");
const constants_1 = require("../../helpers/constants");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const market_config_helpers_2 = require("../../helpers/market-config-helpers");
const env_2 = require("../../helpers/env");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const poolConfig = await (0, market_config_helpers_1.loadPoolConfig)(env_2.MARKET_NAME);
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    // Deploy Mock Flash Loan Receiver if testnet deployment
    if (!hre.config.networks[network].live || poolConfig.TestnetMarket) {
        await deploy("MockFlashLoanReceiver", {
            from: deployer,
            args: [await (await deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID)).address],
            ...env_1.COMMON_DEPLOY_PARAMS,
        });
    }
    return true;
};
// This script can only be run successfully once per market, core version, and network
func.id = `PeripheryInit:${env_2.MARKET_NAME}:aave-v3-periphery@${constants_1.V3_PERIPHERY_VERSION}`;
func.tags = ["market", "init-periphery"];
func.dependencies = [
    "before-deploy",
    "core",
    "periphery-pre",
    "provider",
    "init-pool",
    "oracles",
];
func.skip = async () => (0, market_config_helpers_2.checkRequiredEnvironment)();
exports.default = func;
