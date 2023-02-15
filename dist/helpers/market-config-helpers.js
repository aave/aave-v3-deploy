"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIncentivesEnabled = exports.getPrefixByAssetType = exports.isL2PoolSupported = exports.getOracleByAsset = exports.getReserveAddress = exports.isTestnetMarket = exports.isProductionMarket = exports.getTreasuryAddress = exports.getChainlinkOracles = exports.getSymbolsByPrefix = exports.getSubTokensByPrefix = exports.getReserveAddresses = exports.savePoolTokens = exports.checkRequiredEnvironment = exports.loadPoolConfig = exports.getAddressFromConfig = exports.getRequiredParamPerNetwork = exports.getParamPerNetwork = exports.ConfigNames = void 0;
const utils_1 = require("ethers/lib/utils");
const bluebird_1 = __importDefault(require("bluebird"));
const types_1 = require("./types");
const aave_1 = __importDefault(require("../markets/aave"));
const ethereum_1 = __importDefault(require("../markets/ethereum"));
const test_1 = __importDefault(require("../markets/test"));
const harmony_1 = __importDefault(require("../markets/harmony"));
const avalanche_1 = __importDefault(require("../markets/avalanche"));
const fantom_1 = __importDefault(require("../markets/fantom"));
const polygon_1 = __importDefault(require("../markets/polygon"));
const optimistic_1 = __importDefault(require("../markets/optimistic"));
const arbitrum_1 = __importDefault(require("../markets/arbitrum"));
const utils_2 = require("./utilities/utils");
const deploy_ids_1 = require("./deploy-ids");
const constants_1 = require("./constants");
const _1 = require(".");
const env_1 = require("./env");
var ConfigNames;
(function (ConfigNames) {
    ConfigNames["Commons"] = "Commons";
    ConfigNames["Aave"] = "Aave";
    ConfigNames["Test"] = "Test";
    ConfigNames["Harmony"] = "Harmony";
    ConfigNames["Avalanche"] = "Avalanche";
    ConfigNames["Fantom"] = "Fantom";
    ConfigNames["Polygon"] = "Polygon";
    ConfigNames["Optimistic"] = "Optimistic";
    ConfigNames["Arbitrum"] = "Arbitrum";
    ConfigNames["Ethereum"] = "Ethereum";
})(ConfigNames = exports.ConfigNames || (exports.ConfigNames = {}));
const getParamPerNetwork = (param, network) => {
    if (!param)
        return undefined;
    return param[network];
};
exports.getParamPerNetwork = getParamPerNetwork;
const getRequiredParamPerNetwork = (poolConfig, key, network) => {
    const mapNetworkToValue = poolConfig[key];
    if (!mapNetworkToValue)
        throw `[config] missing required parameter ${key} at market config`;
    const value = mapNetworkToValue[network];
    if (!value)
        throw `[config] missing required value at ${key}.${network}`;
    return value;
};
exports.getRequiredParamPerNetwork = getRequiredParamPerNetwork;
const getAddressFromConfig = (param, network, key) => {
    const value = (0, exports.getParamPerNetwork)(param, network);
    if (!value || !(0, utils_2.isValidAddress)(value)) {
        throw Error(`[aave-v3-deploy] Input parameter ${key ? `"${key}"` : ""} is missing or is not an address.`);
    }
    return value;
};
exports.getAddressFromConfig = getAddressFromConfig;
const loadPoolConfig = (configName) => {
    switch (configName) {
        case ConfigNames.Aave:
            return aave_1.default;
        case ConfigNames.Test:
            return test_1.default;
        case ConfigNames.Harmony:
            return harmony_1.default;
        case ConfigNames.Avalanche:
            return avalanche_1.default;
        case ConfigNames.Fantom:
            return fantom_1.default;
        case ConfigNames.Polygon:
            return polygon_1.default;
        case ConfigNames.Optimistic:
            return optimistic_1.default;
        case ConfigNames.Arbitrum:
            return arbitrum_1.default;
        case ConfigNames.Ethereum:
            return ethereum_1.default;
        default:
            throw new Error(`Unsupported pool configuration: ${configName} is not one of the supported configs ${Object.values(ConfigNames)}`);
    }
};
exports.loadPoolConfig = loadPoolConfig;
const checkRequiredEnvironment = () => {
    if (!env_1.MARKET_NAME) {
        console.error(`Skipping Market deployment due missing "MARKET_NAME" environment variable.`);
        return true;
    }
    return false;
};
exports.checkRequiredEnvironment = checkRequiredEnvironment;
const savePoolTokens = async (reservesConfig, dataProviderAddress) => {
    const dataProviderArtifact = await hre.deployments.get(_1.POOL_DATA_PROVIDER);
    const dataProvider = (await hre.ethers.getContractAt(dataProviderArtifact.abi, dataProviderAddress));
    const aTokenArtifact = await hre.deployments.getExtendedArtifact("AToken");
    const variableDebtTokenArtifact = await hre.deployments.getExtendedArtifact("VariableDebtToken");
    const stableDebtTokenArtifact = await hre.deployments.getExtendedArtifact("StableDebtToken");
    return bluebird_1.default.each(Object.keys(reservesConfig), async (tokenSymbol) => {
        const { aTokenAddress, variableDebtTokenAddress, stableDebtTokenAddress } = await dataProvider.getReserveTokensAddresses(reservesConfig[tokenSymbol]);
        await hre.deployments.save(`${tokenSymbol}${deploy_ids_1.ATOKEN_PREFIX}`, {
            address: aTokenAddress,
            ...aTokenArtifact,
        });
        await hre.deployments.save(`${tokenSymbol}${deploy_ids_1.VARIABLE_DEBT_PREFIX}`, {
            address: variableDebtTokenAddress,
            ...variableDebtTokenArtifact,
        });
        await hre.deployments.save(`${tokenSymbol}${deploy_ids_1.STABLE_DEBT_PREFIX}`, {
            address: stableDebtTokenAddress,
            ...stableDebtTokenArtifact,
        });
    });
};
exports.savePoolTokens = savePoolTokens;
const getReserveAddresses = async (poolConfig, network) => {
    const isLive = hre.config.networks[network].live;
    if (isLive && !poolConfig.TestnetMarket) {
        console.log("[NOTICE] Using ReserveAssets from configuration file");
        return ((0, exports.getParamPerNetwork)(poolConfig.ReserveAssets, network) || {});
    }
    console.log("[WARNING] Using deployed Testnet tokens instead of ReserveAssets from configuration file");
    const allDeployments = await hre.deployments.all();
    const result = {};
    for (let key in constants_1.TESTNET_TOKENS) {
        result[key] = allDeployments[constants_1.TESTNET_TOKENS[key]].address;
    }
    return result;
};
exports.getReserveAddresses = getReserveAddresses;
const getSubTokensByPrefix = async (prefix) => {
    const allDeployments = await hre.deployments.all();
    const tokenKeys = Object.keys(allDeployments).filter((key) => key.includes(prefix));
    if (!tokenKeys.length) {
        return [];
    }
    return tokenKeys.reduce((acc, key) => {
        acc.push({
            symbol: key.replace(prefix, ""),
            artifact: allDeployments[key],
        });
        return acc;
    }, []);
};
exports.getSubTokensByPrefix = getSubTokensByPrefix;
const getSymbolsByPrefix = async (prefix) => {
    const allDeployments = await hre.deployments.all();
    const tokenKeys = Object.keys(allDeployments).filter((key) => key.includes(prefix));
    if (!tokenKeys.length) {
        return [];
    }
    return tokenKeys.reduce((acc, key) => {
        acc.push(key.replace(prefix, ""));
        return acc;
    }, []);
};
exports.getSymbolsByPrefix = getSymbolsByPrefix;
const getChainlinkOracles = async (poolConfig, network) => {
    const isLive = hre.config.networks[network].live;
    if (isLive) {
        console.log("[NOTICE] Using ChainlinkAggregator from configuration file");
        return ((0, exports.getParamPerNetwork)(poolConfig.ChainlinkAggregator, network) || {});
    }
    console.log("[WARNING] Using deployed Mock Price Aggregators instead of ChainlinkAggregator from configuration file");
    let rewardKeys = [];
    if ((0, exports.isIncentivesEnabled)(poolConfig)) {
        rewardKeys = await (0, exports.getSymbolsByPrefix)(deploy_ids_1.TESTNET_REWARD_TOKEN_PREFIX);
    }
    const reservesKeys = Object.keys(poolConfig.ReservesConfig);
    const allDeployments = await hre.deployments.all();
    const testnetKeys = Object.keys(allDeployments).filter((key) => key.includes(deploy_ids_1.TESTNET_PRICE_AGGR_PREFIX) &&
        (reservesKeys.includes(key.replace(deploy_ids_1.TESTNET_PRICE_AGGR_PREFIX, "")) ||
            rewardKeys.includes(key.replace(deploy_ids_1.TESTNET_PRICE_AGGR_PREFIX, ""))));
    return testnetKeys.reduce((acc, key) => {
        const symbol = key.replace(deploy_ids_1.TESTNET_PRICE_AGGR_PREFIX, "");
        acc[symbol] = allDeployments[key].address;
        return acc;
    }, {});
};
exports.getChainlinkOracles = getChainlinkOracles;
const getTreasuryAddress = async (poolConfig, network) => {
    const treasuryConfigAddress = (0, exports.getParamPerNetwork)(poolConfig.ReserveFactorTreasuryAddress, network);
    if (treasuryConfigAddress &&
        (0, utils_1.getAddress)(treasuryConfigAddress) !== (0, utils_1.getAddress)(constants_1.ZERO_ADDRESS)) {
        return treasuryConfigAddress;
    }
    console.log("[WARNING] Using latest deployed Treasury proxy instead of ReserveFactorTreasuryAddress from configuration file");
    const deployedTreasury = await hre.deployments.get(deploy_ids_1.TREASURY_PROXY_ID);
    return deployedTreasury.address;
};
exports.getTreasuryAddress = getTreasuryAddress;
const isProductionMarket = (poolConfig) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    return hre.config.networks[network]?.live && !poolConfig.TestnetMarket;
};
exports.isProductionMarket = isProductionMarket;
const isTestnetMarket = (poolConfig) => !(0, exports.isProductionMarket)(poolConfig);
exports.isTestnetMarket = isTestnetMarket;
const getReserveAddress = async (poolConfig, symbol) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    if ((0, exports.isTestnetMarket)(poolConfig)) {
        return await (0, _1.getTestnetReserveAddressFromSymbol)(symbol);
    }
    let assetAddress = poolConfig.ReserveAssets?.[network]?.[symbol];
    const isZeroOrNull = !assetAddress || assetAddress === constants_1.ZERO_ADDRESS;
    if (!assetAddress || isZeroOrNull) {
        throw `Missing asset address for asset ${symbol}`;
    }
    return assetAddress;
};
exports.getReserveAddress = getReserveAddress;
const getOracleByAsset = async (poolConfig, symbol) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    if ((0, exports.isTestnetMarket)(poolConfig)) {
        return (await hre.deployments.get(`${symbol}${deploy_ids_1.TESTNET_PRICE_AGGR_PREFIX}`))
            .address;
    }
    const oracleAddress = poolConfig.ChainlinkAggregator[network]?.[symbol];
    if (!oracleAddress) {
        throw `Missing oracle address for ${symbol}`;
    }
    return oracleAddress;
};
exports.getOracleByAsset = getOracleByAsset;
const isL2PoolSupported = (poolConfig) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    return !!(0, exports.getParamPerNetwork)(poolConfig.L2PoolEnabled, network);
};
exports.isL2PoolSupported = isL2PoolSupported;
const getPrefixByAssetType = (assetType) => {
    switch (assetType) {
        case types_1.AssetType.AToken:
            return deploy_ids_1.ATOKEN_PREFIX;
        case types_1.AssetType.VariableDebtToken:
            return deploy_ids_1.VARIABLE_DEBT_PREFIX;
        case types_1.AssetType.StableDebtToken:
            return deploy_ids_1.STABLE_DEBT_PREFIX;
    }
};
exports.getPrefixByAssetType = getPrefixByAssetType;
const isIncentivesEnabled = (poolConfig) => {
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    if (env_1.ENABLE_REWARDS !== undefined) {
        return !!env_1.ENABLE_REWARDS;
    }
    return !!(0, exports.getParamPerNetwork)(poolConfig.IncentivesConfig.enabled, network);
};
exports.isIncentivesEnabled = isIncentivesEnabled;
