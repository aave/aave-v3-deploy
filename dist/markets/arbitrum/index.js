"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArbitrumConfig = void 0;
const types_1 = require("./../../helpers/types");
const aave_1 = __importDefault(require("../aave"));
const helpers_1 = require("../../helpers");
const reservesConfigs_1 = require("../aave/reservesConfigs");
exports.ArbitrumConfig = {
    ...aave_1.default,
    MarketId: "Arbitrum Aave Market",
    ATokenNamePrefix: "Arbitrum",
    StableDebtTokenNamePrefix: "Arbitrum",
    VariableDebtTokenNamePrefix: "Arbitrum",
    SymbolPrefix: "Arb",
    ProviderId: 36,
    ReservesConfig: {
        DAI: reservesConfigs_1.strategyDAI,
        LINK: reservesConfigs_1.strategyLINK,
        USDC: reservesConfigs_1.strategyUSDC,
        WBTC: reservesConfigs_1.strategyWBTC,
        WETH: reservesConfigs_1.strategyWETH,
        USDT: reservesConfigs_1.strategyUSDT,
        AAVE: reservesConfigs_1.strategyAAVE,
        EURS: reservesConfigs_1.strategyEURS,
    },
    ReserveAssets: {
        [types_1.eArbitrumNetwork.arbitrum]: {
            DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
            LINK: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
            USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
            WBTC: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
            WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
            USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            AAVE: "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
            EURS: "0xD22a58f79e9481D1a88e00c343885A588b34b68B",
        },
        [types_1.eArbitrumNetwork.arbitrumTestnet]: {
            DAI: helpers_1.ZERO_ADDRESS,
            LINK: helpers_1.ZERO_ADDRESS,
            USDC: helpers_1.ZERO_ADDRESS,
            WBTC: helpers_1.ZERO_ADDRESS,
            WETH: helpers_1.ZERO_ADDRESS,
            USDT: helpers_1.ZERO_ADDRESS,
            AAVE: helpers_1.ZERO_ADDRESS,
            EURS: helpers_1.ZERO_ADDRESS,
        },
        [types_1.eArbitrumNetwork.goerliNitro]: {
            DAI: helpers_1.ZERO_ADDRESS,
            LINK: helpers_1.ZERO_ADDRESS,
            USDC: helpers_1.ZERO_ADDRESS,
            WBTC: helpers_1.ZERO_ADDRESS,
            WETH: helpers_1.ZERO_ADDRESS,
            USDT: helpers_1.ZERO_ADDRESS,
            AAVE: helpers_1.ZERO_ADDRESS,
            EURS: helpers_1.ZERO_ADDRESS,
        },
    },
    EModes: {
        StableEMode: {
            id: "1",
            ltv: "9700",
            liquidationThreshold: "9750",
            liquidationBonus: "10100",
            label: "Stablecoins",
            assets: ["USDC", "USDT", "DAI", "EURS"],
        },
    },
    ChainlinkAggregator: {
        [types_1.eArbitrumNetwork.arbitrum]: {
            LINK: "0x86E53CF1B870786351Da77A57575e79CB55812CB",
            USDC: "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3",
            DAI: "0xc5C8E77B397E531B8EC06BFb0048328B30E9eCfB",
            WBTC: "0x6ce185860a4963106506C203335A2910413708e9",
            WETH: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
            USDT: "0x3f3f5dF88dC9F13eac63DF89EC16ef6e7E25DdE7",
            AAVE: "0xaD1d5344AaDE45F43E596773Bcc4c423EAbdD034",
            // Note: Using EUR/USD Chainlink data feed
            EURS: "0xA14d53bC1F1c0F31B4aA3BD109344E5009051a84",
        },
    },
};
exports.default = exports.ArbitrumConfig;
