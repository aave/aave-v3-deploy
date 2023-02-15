"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AaveMarket = void 0;
const helpers_1 = require("../../helpers");
const types_1 = require("../../helpers/types");
const commons_1 = require("./commons");
const reservesConfigs_1 = require("./reservesConfigs");
// ----------------
// POOL--SPECIFIC PARAMS
// ----------------
exports.AaveMarket = {
    ...commons_1.CommonsConfig,
    MarketId: "Testnet Aave Market",
    ProviderId: 8080,
    ReservesConfig: {
        WBTC: reservesConfigs_1.strategyWBTC,
        USDC: reservesConfigs_1.strategyUSDC,
        WETH: reservesConfigs_1.strategyWETH,
    },
    ReserveAssets: {
        [types_1.eEthereumNetwork.main]: {
            WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        },
        [types_1.eEthereumNetwork.kovan]: {
            WBTC: helpers_1.ZERO_ADDRESS,
            USDC: helpers_1.ZERO_ADDRESS,
            WETH: helpers_1.ZERO_ADDRESS,
        },
        [types_1.eArbitrumNetwork.arbitrumTestnet]: {
            WBTC: helpers_1.ZERO_ADDRESS,
            USDC: helpers_1.ZERO_ADDRESS,
            WETH: helpers_1.ZERO_ADDRESS,
        },
        [types_1.eEthereumNetwork.rinkeby]: {
            WBTC: helpers_1.ZERO_ADDRESS,
            USDC: helpers_1.ZERO_ADDRESS,
            WETH: helpers_1.ZERO_ADDRESS,
        },
    },
};
exports.default = exports.AaveMarket;
