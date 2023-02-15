"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimisticConfig = void 0;
const types_1 = require("./../../helpers/types");
const aave_1 = __importDefault(require("../aave"));
const reservesConfigs_1 = require("../aave/reservesConfigs");
const helpers_1 = require("../../helpers");
const reservesConfig_1 = require("./reservesConfig");
exports.OptimisticConfig = {
    ...aave_1.default,
    ProviderId: 35,
    MarketId: "Optimism Aave Market",
    ATokenNamePrefix: "Optimism",
    StableDebtTokenNamePrefix: "Optimism",
    VariableDebtTokenNamePrefix: "Optimism",
    SymbolPrefix: "Opt",
    ReservesConfig: {
        DAI: reservesConfigs_1.strategyDAI,
        LINK: reservesConfigs_1.strategyLINK,
        USDC: reservesConfigs_1.strategyUSDC,
        WBTC: reservesConfigs_1.strategyWBTC,
        WETH: reservesConfigs_1.strategyWETH,
        USDT: reservesConfigs_1.strategyUSDT,
        AAVE: reservesConfigs_1.strategyAAVE,
        SUSD: reservesConfig_1.strategySUSD,
    },
    ReserveAssets: {
        [types_1.eOptimismNetwork.main]: {
            DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
            LINK: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
            USDC: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
            WBTC: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
            WETH: "0x4200000000000000000000000000000000000006",
            USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
            AAVE: "0x76FB31fb4af56892A25e32cFC43De717950c9278",
            SUSD: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
        },
        [types_1.eOptimismNetwork.testnet]: {
            DAI: helpers_1.ZERO_ADDRESS,
            LINK: helpers_1.ZERO_ADDRESS,
            USDC: helpers_1.ZERO_ADDRESS,
            WBTC: helpers_1.ZERO_ADDRESS,
            WETH: helpers_1.ZERO_ADDRESS,
            USDT: helpers_1.ZERO_ADDRESS,
        },
    },
    EModes: {
        StableEMode: {
            id: "1",
            ltv: "9700",
            liquidationThreshold: "9750",
            liquidationBonus: "10100",
            label: "Stablecoins",
            assets: ["USDC", "USDT", "DAI", "SUSD"],
        },
    },
    ChainlinkAggregator: {
        [types_1.eOptimismNetwork.main]: {
            DAI: "0x8dBa75e83DA73cc766A7e5a0ee71F656BAb470d6",
            LINK: "0xCc232dcFAAE6354cE191Bd574108c1aD03f86450",
            USDC: "0x16a9FA2FDa030272Ce99B29CF780dFA30361E0f3",
            WBTC: "0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593",
            WETH: "0x13e3Ee699D1909E989722E753853AE30b17e08c5",
            USDT: "0xECef79E109e997bCA29c1c0897ec9d7b03647F5E",
            AAVE: "0x338ed6787f463394D24813b297401B9F05a8C9d1",
            // Using USDC / USD oracle due missing oracle for SUSD, but usage as collateral is deactivated
            SUSD: "0x16a9FA2FDa030272Ce99B29CF780dFA30361E0f3",
        },
    },
};
exports.default = exports.OptimisticConfig;
