"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvalancheMarket = void 0;
const types_1 = require("./../../helpers/types");
const index_1 = require("../aave/index");
const constants_1 = require("../../helpers/constants");
const reservesConfigs_1 = require("../aave/reservesConfigs");
const reservesConfigs_2 = require("./reservesConfigs");
// ----------------
// POOL--SPECIFIC PARAMS
// ----------------
exports.AvalancheMarket = {
    ...index_1.AaveMarket,
    ProviderId: 32,
    WrappedNativeTokenSymbol: "WAVAX",
    MarketId: "Avalanche Aave Market",
    ATokenNamePrefix: "Avalanche",
    StableDebtTokenNamePrefix: "Avalanche",
    VariableDebtTokenNamePrefix: "Avalanche",
    SymbolPrefix: "Ava",
    ReservesConfig: {
        DAI: reservesConfigs_1.strategyDAI,
        LINK: reservesConfigs_2.strategyLINK,
        USDC: reservesConfigs_2.strategyUSDC,
        WBTC: reservesConfigs_2.strategyWBTC,
        WETH: reservesConfigs_1.strategyWETH,
        USDT: reservesConfigs_1.strategyUSDT,
        AAVE: reservesConfigs_2.strategyAAVE,
        WAVAX: reservesConfigs_2.strategyWAVAX,
    },
    ReserveAssets: {
        [types_1.eAvalancheNetwork.avalanche]: {
            DAI: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
            LINK: "0x5947BB275c521040051D82396192181b413227A3",
            USDC: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
            WBTC: "0x50b7545627a5162F82A992c33b87aDc75187B218",
            WETH: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
            USDT: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
            AAVE: "0x63a72806098Bd3D9520cC43356dD78afe5D386D9",
            WAVAX: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        },
        [types_1.eAvalancheNetwork.fuji]: {
            AAVE: constants_1.ZERO_ADDRESS,
            DAI: constants_1.ZERO_ADDRESS,
            LINK: constants_1.ZERO_ADDRESS,
            USDC: constants_1.ZERO_ADDRESS,
            WBTC: constants_1.ZERO_ADDRESS,
            WETH: constants_1.ZERO_ADDRESS,
            USDT: constants_1.ZERO_ADDRESS,
            WAVAX: constants_1.ZERO_ADDRESS,
        },
    },
    ChainlinkAggregator: {
        [types_1.eAvalancheNetwork.avalanche]: {
            DAI: "0x51D7180edA2260cc4F6e4EebB82FEF5c3c2B8300",
            LINK: "0x49ccd9ca821EfEab2b98c60dC60F518E765EDe9a",
            USDC: "0xF096872672F44d6EBA71458D74fe67F9a77a23B9",
            WBTC: "0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743",
            WETH: "0x976B3D034E162d8bD72D6b9C989d545b839003b0",
            USDT: "0xEBE676ee90Fe1112671f19b6B7459bC678B67e8a",
            AAVE: "0x3CA13391E9fb38a75330fb28f8cc2eB3D9ceceED",
            WAVAX: "0x0A77230d17318075983913bC2145DB16C7366156",
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
exports.default = exports.AvalancheMarket;
