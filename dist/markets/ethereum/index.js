"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumV3Market = void 0;
const types_1 = require("../../helpers/types");
const index_1 = require("../aave/index");
// ----------------
// POOL--SPECIFIC PARAMS
// ----------------
exports.EthereumV3Market = {
    ...index_1.AaveMarket,
    ProviderId: 30,
    WrappedNativeTokenSymbol: "WETH",
    MarketId: "Aave Ethereum Market",
    ATokenNamePrefix: "Ethereum",
    StableDebtTokenNamePrefix: "Ethereum",
    VariableDebtTokenNamePrefix: "Ethereum",
    SymbolPrefix: "Eth",
    ReserveAssets: {},
    ChainlinkAggregator: {},
    ReservesConfig: {},
    EModes: {},
    ReserveFactorTreasuryAddress: {
        [types_1.eEthereumNetwork.main]: "0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c",
    },
};
exports.default = exports.EthereumV3Market;
