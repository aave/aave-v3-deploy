"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FantomMarket = void 0;
const types_1 = require("../../helpers/types");
const index_1 = require("../aave/index");
const reservesConfigs_1 = require("../aave/reservesConfigs");
const constants_1 = require("../../helpers/constants");
const reservesConfigs_2 = require("./reservesConfigs");
// ----------------
// POOL--SPECIFIC PARAMS
// ----------------
exports.FantomMarket = {
    ...index_1.AaveMarket,
    ProviderId: 33,
    WrappedNativeTokenSymbol: "WFTM",
    MarketId: "Fantom Aave Market",
    ATokenNamePrefix: "Fantom",
    StableDebtTokenNamePrefix: "Fantom",
    VariableDebtTokenNamePrefix: "Fantom",
    SymbolPrefix: "Fan",
    ReservesConfig: {
        DAI: reservesConfigs_1.strategyDAI,
        LINK: reservesConfigs_2.strategyLINK,
        USDC: reservesConfigs_2.strategyUSDC,
        WBTC: reservesConfigs_2.strategyWBTC,
        WETH: reservesConfigs_1.strategyWETH,
        USDT: reservesConfigs_1.strategyUSDT,
        AAVE: reservesConfigs_2.strategyAAVE,
        WFTM: reservesConfigs_2.strategyWFTM,
        CRV: reservesConfigs_2.strategyCRV,
        SUSHI: reservesConfigs_2.strategySUSHI,
    },
    ReserveAssets: {
        [types_1.eFantomNetwork.main]: {
            DAI: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
            LINK: "0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8",
            USDC: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
            WBTC: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
            WETH: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
            USDT: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
            AAVE: "0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B",
            WFTM: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
            SUSHI: "0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC",
            CRV: "0x1E4F97b9f9F913c46F1632781732927B9019C68b",
        },
        [types_1.eFantomNetwork.testnet]: {
            AAVE: constants_1.ZERO_ADDRESS,
            DAI: constants_1.ZERO_ADDRESS,
            LINK: constants_1.ZERO_ADDRESS,
            USDC: constants_1.ZERO_ADDRESS,
            WBTC: constants_1.ZERO_ADDRESS,
            WETH: constants_1.ZERO_ADDRESS,
            USDT: constants_1.ZERO_ADDRESS,
            WFTM: constants_1.ZERO_ADDRESS,
        },
    },
    ChainlinkAggregator: {
        [types_1.eFantomNetwork.main]: {
            AAVE: "0xE6ecF7d2361B6459cBb3b4fb065E0eF4B175Fe74",
            DAI: "0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52",
            LINK: "0x221C773d8647BC3034e91a0c47062e26D20d97B4",
            USDC: "0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c",
            WBTC: "0x8e94C22142F4A64b99022ccDd994f4e9EC86E4B4",
            WETH: "0x11DdD3d147E5b83D01cee7070027092397d63658",
            USDT: "0xF64b636c5dFe1d3555A847341cDC449f612307d0",
            WFTM: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc",
            SUSHI: "0xCcc059a1a17577676c8673952Dc02070D29e5a66",
            CRV: "0xa141D7E3B44594cc65142AE5F2C7844Abea66D2B",
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
};
exports.default = exports.FantomMarket;
