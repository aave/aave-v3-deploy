"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarmonyMarket = void 0;
const rateStrategies_1 = require("./rateStrategies");
const types_1 = require("../../helpers/types");
const index_1 = require("../aave/index");
const reservesConfig_1 = require("./reservesConfig");
const constants_1 = require("../../helpers/constants");
// ----------------
// POOL--SPECIFIC PARAMS
// ----------------
exports.HarmonyMarket = {
    ...index_1.AaveMarket,
    ProviderId: 31,
    WrappedNativeTokenSymbol: "WONE",
    MarketId: "Harmony Aave Market",
    ATokenNamePrefix: "Harmony",
    StableDebtTokenNamePrefix: "Harmony",
    VariableDebtTokenNamePrefix: "Harmony",
    SymbolPrefix: "Har",
    ReservesConfig: {
        DAI: reservesConfig_1.strategyDAI,
        LINK: reservesConfig_1.strategyLINK,
        USDC: reservesConfig_1.strategyUSDC,
        WBTC: reservesConfig_1.strategyWBTC,
        WETH: reservesConfig_1.strategyWETH,
        USDT: reservesConfig_1.strategyUSDT,
        AAVE: reservesConfig_1.strategyAAVE,
        WONE: reservesConfig_1.strategyWONE,
    },
    ReserveAssets: {
        [types_1.eHarmonyNetwork.main]: {
            DAI: "0xEf977d2f931C1978Db5F6747666fa1eACB0d0339",
            LINK: "0x218532a12a389a4a92fC0C5Fb22901D1c19198aA",
            USDC: "0x985458E523dB3d53125813eD68c274899e9DfAb4",
            WBTC: "0x3095c7557bCb296ccc6e363DE01b760bA031F2d9",
            WETH: "0x6983d1e6def3690c4d616b13597a09e6193ea013",
            USDT: "0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f",
            AAVE: "0xcF323Aad9E522B93F11c352CaA519Ad0E14eB40F",
            WONE: "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
        },
        [types_1.eHarmonyNetwork.testnet]: {
            AAVE: constants_1.ZERO_ADDRESS,
            DAI: constants_1.ZERO_ADDRESS,
            LINK: constants_1.ZERO_ADDRESS,
            USDC: constants_1.ZERO_ADDRESS,
            WBTC: constants_1.ZERO_ADDRESS,
            WETH: constants_1.ZERO_ADDRESS,
            USDT: constants_1.ZERO_ADDRESS,
            WONE: constants_1.ZERO_ADDRESS,
        },
    },
    ChainlinkAggregator: {
        [types_1.eHarmonyNetwork.main]: {
            DAI: "0xF8326D22b2CaFF4880115E92161c324AbC5e0395",
            LINK: "0xD54F119D10901b4509610eA259A63169647800C4",
            USDC: "0xA45A41be2D8419B60A6CE2Bc393A0B086b8B3bda",
            WBTC: "0x3C41439Eb1bF3BA3b2C3f8C921088b267f8d11f4",
            WETH: "0xbaf7C8149D586055ed02c286367A41E0aDA96b7C",
            USDT: "0x5CaAeBE5C69a8287bffB9d00b5231bf7254145bf",
            WONE: "0xdCD81FbbD6c4572A69a534D8b8152c562dA8AbEF",
            AAVE: "0x6EE1EfCCe688D5B79CB8a400870AF471c5282992",
        },
    },
    EModes: {
        StableEMode: {
            id: "1",
            ltv: "9700",
            liquidationThreshold: "9750",
            liquidationBonus: "10100",
            label: "Stablecoins",
            assets: ["USDC", "USDT", "DAI"],
        },
    },
    RateStrategies: {
        rateStrategyDebtPrevention: rateStrategies_1.rateStrategyDebtPrevention,
    },
};
exports.default = exports.HarmonyMarket;
