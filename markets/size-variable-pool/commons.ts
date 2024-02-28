import { ZERO_ADDRESS } from "../../helpers/constants";
import { getAccountAddressFromMnemonic } from "../../helpers/hardhat-config-helpers";
import {
  ICommonConfiguration,
  eEthereumNetwork,
} from "../../helpers/types";
import {
  rateStrategyVolatileOne,
} from "./rateStrategies";
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: "Commons Size Variable Pool Market",
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
      USDC: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
      WETH: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    },
    [eEthereumNetwork.sepolia]: {
      USDC: "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
      WETH: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
  },
  ReserveFactorTreasuryAddress: {
    [eEthereumNetwork.main]: "TODO",
    [eEthereumNetwork.sepolia]: getAccountAddressFromMnemonic()
  },
  FallbackOracle: {
    [eEthereumNetwork.main]: ZERO_ADDRESS,
    [eEthereumNetwork.sepolia]: ZERO_ADDRESS,
  },
  ReservesConfig: {},
  IncentivesConfig: {
    enabled: {
    },
    rewards: {
    },
    rewardsOracle: {
    },
    incentivesInput: {
    },
  },
  EModes: {
  },
  L2PoolEnabled: {
  },
  ParaswapRegistry: {
  },
  FlashLoanPremiums: {
    total: 1.0000e4,
    protocol: 1.0000e4,
  },
  RateStrategies: {
    rateStrategyVolatileOne,
  },
};
