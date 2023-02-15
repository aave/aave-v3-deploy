"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_ids_1 = require("./../../../helpers/deploy-ids");
const market_config_helpers_1 = require("./../../../helpers/market-config-helpers");
const env_1 = require("../../../helpers/env");
const market_config_helpers_2 = require("../../../helpers/market-config-helpers");
const deploy_ids_2 = require("../../../helpers/deploy-ids");
const constants_1 = require("../../../helpers/constants");
const bluebird_1 = __importDefault(require("bluebird"));
const env_2 = require("../../../helpers/env");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const poolConfig = await (0, market_config_helpers_2.loadPoolConfig)(env_2.MARKET_NAME);
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    if ((0, market_config_helpers_2.isProductionMarket)(poolConfig)) {
        console.log("[NOTICE] Skipping deployment of testnet price aggregators");
        return;
    }
    const reserves = await (0, market_config_helpers_2.getReserveAddresses)(poolConfig, network);
    let symbols = Object.keys(reserves);
    if ((0, market_config_helpers_1.isIncentivesEnabled)(poolConfig)) {
        const rewards = await (0, market_config_helpers_1.getSymbolsByPrefix)(deploy_ids_1.TESTNET_REWARD_TOKEN_PREFIX);
        symbols = [...symbols, ...rewards];
    }
    // Iterate each token symbol and deploy a mock aggregator
    await bluebird_1.default.each(symbols, async (symbol) => {
        const price = symbol === "StkAave"
            ? constants_1.MOCK_CHAINLINK_AGGREGATORS_PRICES["AAVE"]
            : constants_1.MOCK_CHAINLINK_AGGREGATORS_PRICES[symbol];
        if (!price) {
            throw `[ERROR] Missing mock price for asset ${symbol} at MOCK_CHAINLINK_AGGREGATORS_PRICES constant located at src/constants.ts`;
        }
        await deploy(`${symbol}${deploy_ids_2.TESTNET_PRICE_AGGR_PREFIX}`, {
            args: [price],
            from: deployer,
            ...env_1.COMMON_DEPLOY_PARAMS,
            contract: "MockAggregator",
        });
    });
    return true;
};
// This script can only be run successfully once per market, core version, and network
func.id = `MockPriceAggregators:${env_2.MARKET_NAME}:aave-v3-core@${constants_1.V3_CORE_VERSION}`;
func.tags = ["market", "init-testnet", "price-aggregators-setup"];
func.dependencies = ["before-deploy", "tokens-setup", "periphery-pre"];
func.skip = async () => (0, market_config_helpers_2.checkRequiredEnvironment)();
exports.default = func;
