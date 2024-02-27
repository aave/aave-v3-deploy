import {
  AssetType,
  eAvalancheNetwork,
  eFantomNetwork,
  eHarmonyNetwork,
  eOptimismNetwork,
  ePolygonNetwork,
  TransferStrategy,
  eBaseNetwork,
} from "./../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers/constants";
import {
  ICommonConfiguration,
  eEthereumNetwork,
  eArbitrumNetwork,
} from "../../helpers/types";
import {
  rateStrategyStableOne,
  rateStrategyStableTwo,
  rateStrategyVolatileOne,
} from "./rateStrategies";
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: "Commons Aave Market",
  ATokenNamePrefix: "Ethereum",
  StableDebtTokenNamePrefix: "Ethereum",
  VariableDebtTokenNamePrefix: "Ethereum",
  SymbolPrefix: "Eth",
  ProviderId: 8080,
  OracleQuoteCurrencyAddress: ZERO_ADDRESS,
  OracleQuoteCurrency: "USD",
  OracleQuoteUnit: "8",
  WrappedNativeTokenSymbol: "WETH",
  ChainlinkAggregator: {
    [eEthereumNetwork.main]: {
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
    [eEthereumNetwork.rinkeby]: {
      LINK: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
      EURS: ZERO_ADDRESS,
    },
  },
  ReserveFactorTreasuryAddress: {
    [eEthereumNetwork.kovan]: "0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c",
    [eEthereumNetwork.main]: "0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c",
    [eArbitrumNetwork.arbitrumTestnet]:
      "0xeC67987831C4278160D8e652d3edb0Fc45B3766d",
    [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
  },
  FallbackOracle: {
    [eEthereumNetwork.kovan]: ZERO_ADDRESS,
    [eEthereumNetwork.main]: ZERO_ADDRESS,
    [eArbitrumNetwork.arbitrum]: ZERO_ADDRESS,
    [eArbitrumNetwork.arbitrumTestnet]: ZERO_ADDRESS,
    [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
  },
  ReservesConfig: {},
  IncentivesConfig: {
    enabled: {
      [eArbitrumNetwork.arbitrum]: true,
      [ePolygonNetwork.polygon]: true,
      [eOptimismNetwork.main]: true,
      [eFantomNetwork.main]: true,
      [eHarmonyNetwork.main]: true,
      [eAvalancheNetwork.avalanche]: true,
    },
    rewards: {
      [eArbitrumNetwork.arbitrumTestnet]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
      [eEthereumNetwork.kovan]: {
        StkAave: ZERO_ADDRESS,
      },
      [eEthereumNetwork.rinkeby]: {
        StkAave: ZERO_ADDRESS,
      },
    },
    rewardsOracle: {
      [eArbitrumNetwork.arbitrumTestnet]: {
        StkAave: ZERO_ADDRESS,
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
      },
      [eEthereumNetwork.kovan]: {
        StkAave: ZERO_ADDRESS,
      },
      [eEthereumNetwork.rinkeby]: {
        StkAave: ZERO_ADDRESS,
      },
    },
    incentivesInput: {
      [eArbitrumNetwork.arbitrumTestnet]: [
        {
          emissionPerSecond: "34629756533",
          duration: 7890000,
          asset: "DAI",
          assetType: AssetType.AToken,
          reward: "CRV",
          rewardOracle: "0",
          transferStrategy: TransferStrategy.PullRewardsStrategy,
          transferStrategyParams: "0",
        },
        {
          emissionPerSecond: "300801036720127500",
          duration: 7890000,
          asset: "USDC",
          assetType: AssetType.AToken,
          reward: "REW",
          rewardOracle: "0",
          transferStrategy: TransferStrategy.PullRewardsStrategy,
          transferStrategyParams: "0",
        },
        {
          emissionPerSecond: "300801036720127500",
          duration: 7890000,
          asset: "LINK",
          assetType: AssetType.AToken,
          reward: "REW",
          rewardOracle: "0",
          transferStrategy: TransferStrategy.PullRewardsStrategy,
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
    [eArbitrumNetwork.arbitrum]: true,
    [eArbitrumNetwork.goerliNitro]: true,
    [eArbitrumNetwork.arbitrumTestnet]: true,
    [eOptimismNetwork.main]: true,
    [eOptimismNetwork.testnet]: true,
    [eBaseNetwork.base]: true,
    [eBaseNetwork.baseGoerli]: true,
  },
  ParaswapRegistry: {
    [eEthereumNetwork.main]: "0xa68bEA62Dc4034A689AA0F58A76681433caCa663",
    [ePolygonNetwork.polygon]: "0xca35a4866747Ff7A604EF7a2A7F246bb870f3ca1",
    [eAvalancheNetwork.avalanche]: "0xfD1E5821F07F1aF812bB7F3102Bfd9fFb279513a",
    [eFantomNetwork.main]: "0x161383b5dAFc1cc05Ec058e5B0b0703BA175bdA6",
    [eArbitrumNetwork.arbitrum]: "0xdC6E2b14260F972ad4e5a31c68294Fba7E720701",
    [eBaseNetwork.base]: "0x7e31b336f9e8ba52ba3c4ac861b033ba90900bb3",
    [eBaseNetwork.baseGoerli]: "0x7e31b336f9e8ba52ba3c4ac861b033ba90900bb3",
    [eEthereumNetwork.tenderly]: "0xa68bEA62Dc4034A689AA0F58A76681433caCa663",
    [eOptimismNetwork.main]: "0x6e7bE86000dF697facF4396efD2aE2C322165dC3",
  },
  FlashLoanPremiums: {
    total: 0.0005e4,
    protocol: 0.0004e4,
  },
  RateStrategies: {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
  },
};
