"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const env_1 = require("../../helpers/env");
const helpers_1 = require("../../helpers");
const env_2 = require("../../helpers/env");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    const poolConfig = await (0, helpers_1.loadPoolConfig)(env_2.MARKET_NAME);
    const paraswapAugustusRegistry = (0, market_config_helpers_1.getParamPerNetwork)(poolConfig.ParaswapRegistry, network);
    if (!paraswapAugustusRegistry) {
        console.log("[WARNING] Skipping the deployment of the Paraswap Liquidity Swap and Repay adapters due missing 'ParaswapRegistry' address at pool configuration.");
        return;
    }
    const { address: addressesProvider } = await deployments.get(helpers_1.POOL_ADDRESSES_PROVIDER_ID);
    const poolAdmin = helpers_1.POOL_ADMIN[network];
    await deploy("ParaSwapLiquiditySwapAdapter", {
        from: deployer,
        ...env_1.COMMON_DEPLOY_PARAMS,
        args: [addressesProvider, paraswapAugustusRegistry, poolAdmin],
    });
    await deploy("ParaSwapRepayAdapter", {
        from: deployer,
        ...env_1.COMMON_DEPLOY_PARAMS,
        args: [addressesProvider, paraswapAugustusRegistry, poolAdmin],
    });
    return true;
};
// This script can only be run successfully once per market, core version, and network
func.id = `ParaswapAdapters:${env_2.MARKET_NAME}:aave-v3-periphery@${helpers_1.V3_PERIPHERY_VERSION}`;
func.tags = ["periphery-post", "paraswap-adapters"];
exports.default = func;
