"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonsConfig = void 0;
const types_1 = require("./../../helpers/types");
const constants_1 = require("../../helpers/constants");
const types_2 = require("../../helpers/types");
const rateStrategies_1 = require("./rateStrategies");
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------
exports.CommonsConfig = {
    MarketId: "Commons Aave Market",
    ATokenNamePrefix: "Ethereum",
    StableDebtTokenNamePrefix: "Ethereum",
    VariableDebtTokenNamePrefix: "Ethereum",
    SymbolPrefix: "Eth",
    ProviderId: 8080,
    OracleQuoteCurrencyAddress: constants_1.ZERO_ADDRESS,
    OracleQuoteCurrency: "USD",
    OracleQuoteUnit: "8",
    WrappedNativeTokenSymbol: "WETH",
    ChainlinkAggregator: {
        [types_2.eEthereumNetwork.main]: {
            AAVE: "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9",
            DAI: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
            LINK: "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c",
            USDC: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
            WBTC: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
            WETH: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
            USDT: "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
            // Note: EUR/USD, not EURS dedicated oracle
            EURS: "0xb49f677943BC038e9857d61E7d053CaA2C1734C1",
        },
        [types_2.eEthereumNetwork.rinkeby]: {
            LINK: constants_1.ZERO_ADDRESS,
            USDC: constants_1.ZERO_ADDRESS,
            DAI: constants_1.ZERO_ADDRESS,
            WBTC: constants_1.ZERO_ADDRESS,
            WETH: constants_1.ZERO_ADDRESS,
            USDT: constants_1.ZERO_ADDRESS,
            EURS: constants_1.ZERO_ADDRESS,
        },
    },
    ReserveFactorTreasuryAddress: {
        [types_2.eEthereumNetwork.kovan]: "0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c",
        [types_2.eEthereumNetwork.main]: "0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c",
        [types_2.eArbitrumNetwork.arbitrumTestnet]: "0xeC67987831C4278160D8e652d3edb0Fc45B3766d",
        [types_2.eEthereumNetwork.rinkeby]: constants_1.ZERO_ADDRESS,
    },
    FallbackOracle: {
        [types_2.eEthereumNetwork.kovan]: constants_1.ZERO_ADDRESS,
        [types_2.eEthereumNetwork.main]: constants_1.ZERO_ADDRESS,
        [types_2.eArbitrumNetwork.arbitrum]: constants_1.ZERO_ADDRESS,
        [types_2.eArbitrumNetwork.arbitrumTestnet]: constants_1.ZERO_ADDRESS,
        [types_2.eEthereumNetwork.rinkeby]: constants_1.ZERO_ADDRESS,
    },
    ReservesConfig: {},
    IncentivesConfig: {
        enabled: {
            [types_2.eArbitrumNetwork.arbitrum]: true,
            [types_1.ePolygonNetwork.polygon]: true,
            [types_1.eOptimismNetwork.main]: true,
            [types_1.eFantomNetwork.main]: true,
            [types_1.eHarmonyNetwork.main]: true,
            [types_1.eAvalancheNetwork.avalanche]: true,
        },
        rewards: {
            [types_2.eArbitrumNetwork.arbitrumTestnet]: {
                CRV: constants_1.ZERO_ADDRESS,
                REW: constants_1.ZERO_ADDRESS,
                BAL: constants_1.ZERO_ADDRESS,
                StkAave: constants_1.ZERO_ADDRESS,
            },
            [types_2.eEthereumNetwork.kovan]: {
                StkAave: constants_1.ZERO_ADDRESS,
            },
            [types_2.eEthereumNetwork.rinkeby]: {
                StkAave: constants_1.ZERO_ADDRESS,
            },
        },
        rewardsOracle: {
            [types_2.eArbitrumNetwork.arbitrumTestnet]: {
                StkAave: constants_1.ZERO_ADDRESS,
                CRV: constants_1.ZERO_ADDRESS,
                REW: constants_1.ZERO_ADDRESS,
                BAL: constants_1.ZERO_ADDRESS,
            },
            [types_2.eEthereumNetwork.kovan]: {
                StkAave: constants_1.ZERO_ADDRESS,
            },
            [types_2.eEthereumNetwork.rinkeby]: {
                StkAave: constants_1.ZERO_ADDRESS,
            },
        },
        incentivesInput: {
            [types_2.eArbitrumNetwork.arbitrumTestnet]: [
                {
                    emissionPerSecond: "34629756533",
                    duration: 7890000,
                    asset: "DAI",
                    assetType: types_1.AssetType.AToken,
                    reward: "CRV",
                    rewardOracle: "0",
                    transferStrategy: types_1.TransferStrategy.PullRewardsStrategy,
                    transferStrategyParams: "0",
                },
                {
                    emissionPerSecond: "300801036720127500",
                    duration: 7890000,
                    asset: "USDC",
                    assetType: types_1.AssetType.AToken,
                    reward: "REW",
                    rewardOracle: "0",
                    transferStrategy: types_1.TransferStrategy.PullRewardsStrategy,
                    transferStrategyParams: "0",
                },
                {
                    emissionPerSecond: "300801036720127500",
                    duration: 7890000,
                    asset: "LINK",
                    assetType: types_1.AssetType.AToken,
                    reward: "REW",
                    rewardOracle: "0",
                    transferStrategy: types_1.TransferStrategy.PullRewardsStrategy,
                    transferStrategyParams: "0",
                },
            ],
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
    L2PoolEnabled: {
        [types_2.eArbitrumNetwork.arbitrum]: true,
        [types_2.eArbitrumNetwork.goerliNitro]: true,
        [types_2.eArbitrumNetwork.arbitrumTestnet]: true,
        [types_1.eOptimismNetwork.main]: true,
        [types_1.eOptimismNetwork.testnet]: true,
    },
    ParaswapRegistry: {
        [types_2.eEthereumNetwork.main]: "0xa68bEA62Dc4034A689AA0F58A76681433caCa663",
        [types_1.ePolygonNetwork.polygon]: "0xca35a4866747Ff7A604EF7a2A7F246bb870f3ca1",
        [types_1.eAvalancheNetwork.avalanche]: "0xfD1E5821F07F1aF812bB7F3102Bfd9fFb279513a",
        [types_1.eFantomNetwork.main]: "0x161383b5dAFc1cc05Ec058e5B0b0703BA175bdA6",
        [types_2.eArbitrumNetwork.arbitrum]: "0xdC6E2b14260F972ad4e5a31c68294Fba7E720701",
    },
    FlashLoanPremiums: {
        total: 0.0005e4,
        protocol: 0.0004e4,
    },
    RateStrategies: {
        rateStrategyVolatileOne: rateStrategies_1.rateStrategyVolatileOne,
        rateStrategyStableOne: rateStrategies_1.rateStrategyStableOne,
        rateStrategyStableTwo: rateStrategies_1.rateStrategyStableTwo,
    },
};
