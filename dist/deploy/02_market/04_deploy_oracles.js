"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const env_1 = require("../../helpers/env");
const constants_1 = require("../../helpers/constants");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const market_config_helpers_2 = require("../../helpers/market-config-helpers");
const init_helpers_1 = require("../../helpers/init-helpers");
const utils_1 = require("ethers/lib/utils");
const env_2 = require("../../helpers/env");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const poolConfig = await (0, market_config_helpers_2.loadPoolConfig)(env_2.MARKET_NAME);
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    const { OracleQuoteUnit } = poolConfig;
    const { address: addressesProviderAddress } = await deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID);
    const fallbackOracleAddress = constants_1.ZERO_ADDRESS;
    const reserveAssets = await (0, market_config_helpers_2.getReserveAddresses)(poolConfig, network);
    const chainlinkAggregators = await (0, market_config_helpers_1.getChainlinkOracles)(poolConfig, network);
    const [assets, sources] = (0, init_helpers_1.getPairsTokenAggregator)(reserveAssets, chainlinkAggregators);
    // Deploy AaveOracle
    await deploy(deploy_ids_1.ORACLE_ID, {
        from: deployer,
        args: [
            addressesProviderAddress,
            assets,
            sources,
            fallbackOracleAddress,
            constants_1.ZERO_ADDRESS,
            (0, utils_1.parseUnits)("1", OracleQuoteUnit),
        ],
        ...env_1.COMMON_DEPLOY_PARAMS,
        contract: "AaveOracle",
    });
    return true;
};
func.id = `Oracles:${env_2.MARKET_NAME}:aave-v3-core@${constants_1.V3_CORE_VERSION}`;
func.tags = ["market", "oracle"];
func.dependencies = ["before-deploy"];
func.skip = async () => (0, market_config_helpers_2.checkRequiredEnvironment)();
exports.default = func;
