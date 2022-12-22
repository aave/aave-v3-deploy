import { parseUnits } from "ethers/lib/utils";
import { ZERO_ADDRESS } from "../../helpers/constants";
import {
  ICommonConfiguration,
  eEthereumNetwork,
  eArbitrumNetwork,
  TransferStrategy,
  AssetType,
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
  MarketId: "Testnet Aave Market",
  ATokenNamePrefix: "Testnet",
  StableDebtTokenNamePrefix: "Testnet",
  VariableDebtTokenNamePrefix: "Testnet",
  SymbolPrefix: "Test",
  ProviderId: 0,
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
    [eArbitrumNetwork.arbitrumTestnet]: {
      LINK: "0x52C9Eb2Cc68555357221CAe1e5f2dD956bC194E5",
      USDC: "0xe020609A0C31f4F96dCBB8DF9882218952dD95c4",
      DAI: "0xcAE7d280828cf4a0869b26341155E4E9b864C7b2",
      WBTC: "0x0c9973e7a27d00e656B9f153348dA46CaD70d03d",
      WETH: "0x5f0423B1a6935dc5596e7A24d98532b67A0AeFd8",
      USDT: "0xb1Ac85E779d05C2901812d812210F6dE144b2df0",
      EURS: ZERO_ADDRESS,
    },
    [eEthereumNetwork.rinkeby]: {
      LINK: ZERO_ADDRESS,
      USDC: "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
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
    [eEthereumNetwork.kovan]: "0x50913E8E1c650E790F8a1E741FF9B1B1bB251dfe",
    [eEthereumNetwork.main]: "0x5b09e578cfeaa23f1b11127a658855434e4f3e09",
    [eArbitrumNetwork.arbitrum]: ZERO_ADDRESS,
    [eArbitrumNetwork.arbitrumTestnet]: ZERO_ADDRESS,
    [eEthereumNetwork.rinkeby]: ZERO_ADDRESS,
  },
  ReservesConfig: {},
  IncentivesConfig: {
    enabled: {
      [eEthereumNetwork.hardhat]: true,
    },
    rewards: {
      [eArbitrumNetwork.arbitrumTestnet]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
      [eEthereumNetwork.kovan]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
      [eEthereumNetwork.rinkeby]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
      [eEthereumNetwork.hardhat]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
    },
    rewardsOracle: {
      [eArbitrumNetwork.arbitrumTestnet]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
      [eEthereumNetwork.kovan]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
      [eEthereumNetwork.rinkeby]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
      [eEthereumNetwork.hardhat]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
    },
    incentivesInput: {
      [eEthereumNetwork.hardhat]: [
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
      ltv: "9800",
      liquidationThreshold: "9850",
      liquidationBonus: "10100",
      label: "Stable-EMode",
      assets: ["USDC", "DAI"],
    },
  },
  FlashLoanPremiums: {
    total: 0.0009e4,
    protocol: 0,
  },
  RateStrategies: {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
  },
};
