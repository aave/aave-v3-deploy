"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonsConfig = void 0;
const constants_1 = require("../../helpers/constants");
const types_1 = require("../../helpers/types");
const rateStrategies_1 = require("./rateStrategies");
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------
exports.CommonsConfig = {
    MarketId: "Testnet Aave Market",
    ATokenNamePrefix: "Testnet",
    StableDebtTokenNamePrefix: "Testnet",
    VariableDebtTokenNamePrefix: "Testnet",
    SymbolPrefix: "Test",
    ProviderId: 0,
    OracleQuoteCurrencyAddress: constants_1.ZERO_ADDRESS,
    OracleQuoteCurrency: "USD",
    OracleQuoteUnit: "8",
    WrappedNativeTokenSymbol: "WETH",
    ChainlinkAggregator: {
        [types_1.eEthereumNetwork.main]: {
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
        [types_1.eArbitrumNetwork.arbitrumTestnet]: {
            LINK: "0x52C9Eb2Cc68555357221CAe1e5f2dD956bC194E5",
            USDC: "0xe020609A0C31f4F96dCBB8DF9882218952dD95c4",
            DAI: "0xcAE7d280828cf4a0869b26341155E4E9b864C7b2",
            WBTC: "0x0c9973e7a27d00e656B9f153348dA46CaD70d03d",
            WETH: "0x5f0423B1a6935dc5596e7A24d98532b67A0AeFd8",
            USDT: "0xb1Ac85E779d05C2901812d812210F6dE144b2df0",
            EURS: constants_1.ZERO_ADDRESS,
        },
        [types_1.eEthereumNetwork.rinkeby]: {
            LINK: constants_1.ZERO_ADDRESS,
            USDC: "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
            DAI: constants_1.ZERO_ADDRESS,
            WBTC: constants_1.ZERO_ADDRESS,
            WETH: constants_1.ZERO_ADDRESS,
            USDT: constants_1.ZERO_ADDRESS,
            EURS: constants_1.ZERO_ADDRESS,
        },
    },
    ReserveFactorTreasuryAddress: {
        [types_1.eEthereumNetwork.kovan]: "0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c",
        [types_1.eEthereumNetwork.main]: "0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c",
        [types_1.eArbitrumNetwork.arbitrumTestnet]: "0xeC67987831C4278160D8e652d3edb0Fc45B3766d",
        [types_1.eEthereumNetwork.rinkeby]: constants_1.ZERO_ADDRESS,
    },
    FallbackOracle: {
        [types_1.eEthereumNetwork.kovan]: "0x50913E8E1c650E790F8a1E741FF9B1B1bB251dfe",
        [types_1.eEthereumNetwork.main]: "0x5b09e578cfeaa23f1b11127a658855434e4f3e09",
        [types_1.eArbitrumNetwork.arbitrum]: constants_1.ZERO_ADDRESS,
        [types_1.eArbitrumNetwork.arbitrumTestnet]: constants_1.ZERO_ADDRESS,
        [types_1.eEthereumNetwork.rinkeby]: constants_1.ZERO_ADDRESS,
    },
    ReservesConfig: {},
    IncentivesConfig: {
        enabled: {
            [types_1.eEthereumNetwork.hardhat]: true,
        },
        rewards: {
            [types_1.eArbitrumNetwork.arbitrumTestnet]: {
                CRV: constants_1.ZERO_ADDRESS,
                REW: constants_1.ZERO_ADDRESS,
                BAL: constants_1.ZERO_ADDRESS,
                StkAave: constants_1.ZERO_ADDRESS,
            },
            [types_1.eEthereumNetwork.kovan]: {
                CRV: constants_1.ZERO_ADDRESS,
                REW: constants_1.ZERO_ADDRESS,
                BAL: constants_1.ZERO_ADDRESS,
                StkAave: constants_1.ZERO_ADDRESS,
            },
            [types_1.eEthereumNetwork.rinkeby]: {
                CRV: constants_1.ZERO_ADDRESS,
                REW: constants_1.ZERO_ADDRESS,
                BAL: constants_1.ZERO_ADDRESS,
                StkAave: constants_1.ZERO_ADDRESS,
            },
            [types_1.eEthereumNetwork.hardhat]: {
                CRV: constants_1.ZERO_ADDRESS,
                REW: constants_1.ZERO_ADDRESS,
                BAL: constants_1.ZERO_ADDRESS,
                StkAave: constants_1.ZERO_ADDRESS,
            },
        },
        rewardsOracle: {
            [types_1.eArbitrumNetwork.arbitrumTestnet]: {
                CRV: constants_1.ZERO_ADDRESS,
                REW: constants_1.ZERO_ADDRESS,
                BAL: constants_1.ZERO_ADDRESS,
                StkAave: constants_1.ZERO_ADDRESS,
            },
            [types_1.eEthereumNetwork.kovan]: {
                CRV: constants_1.ZERO_ADDRESS,
                REW: constants_1.ZERO_ADDRESS,
                BAL: constants_1.ZERO_ADDRESS,
                StkAave: constants_1.ZERO_ADDRESS,
            },
            [types_1.eEthereumNetwork.rinkeby]: {
                CRV: constants_1.ZERO_ADDRESS,
                REW: constants_1.ZERO_ADDRESS,
                BAL: constants_1.ZERO_ADDRESS,
                StkAave: constants_1.ZERO_ADDRESS,
            },
            [types_1.eEthereumNetwork.hardhat]: {
                CRV: constants_1.ZERO_ADDRESS,
                REW: constants_1.ZERO_ADDRESS,
                BAL: constants_1.ZERO_ADDRESS,
                StkAave: constants_1.ZERO_ADDRESS,
            },
        },
        incentivesInput: {
            [types_1.eEthereumNetwork.hardhat]: [
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
            ltv: "9800",
            liquidationThreshold: "9850",
            liquidationBonus: "10100",
            label: "Stable-EMode",
            assets: ["USDC"],
        },
    },
    FlashLoanPremiums: {
        total: 0.0009e4,
        protocol: 0,
    },
    RateStrategies: {
        rateStrategyVolatileOne: rateStrategies_1.rateStrategyVolatileOne,
        rateStrategyStableOne: rateStrategies_1.rateStrategyStableOne,
        rateStrategyStableTwo: rateStrategies_1.rateStrategyStableTwo,
    },
};
