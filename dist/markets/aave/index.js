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
    MarketId: "Ethereum Aave Market",
    ATokenNamePrefix: "Ethereum",
    StableDebtTokenNamePrefix: "Ethereum",
    VariableDebtTokenNamePrefix: "Ethereum",
    SymbolPrefix: "Eth",
    ProviderId: 30,
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
        [types_1.eEthereumNetwork.main]: {
            DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
            USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            AAVE: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
            EURS: "0xdb25f211ab05b1c97d595516f45794528a807ad8",
        },
        [types_1.eEthereumNetwork.rinkeby]: {
            AAVE: helpers_1.ZERO_ADDRESS,
            DAI: helpers_1.ZERO_ADDRESS,
            LINK: helpers_1.ZERO_ADDRESS,
            USDC: helpers_1.ZERO_ADDRESS,
            WBTC: helpers_1.ZERO_ADDRESS,
            WETH: helpers_1.ZERO_ADDRESS,
            USDT: helpers_1.ZERO_ADDRESS,
            EURS: helpers_1.ZERO_ADDRESS,
        },
    },
    StkAaveProxy: {
        [types_1.eEthereumNetwork.main]: "0x4da27a545c0c5B758a6BA100e3a049001de870f5",
    },
};
exports.default = exports.AaveMarket;
