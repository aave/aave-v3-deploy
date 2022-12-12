import {
  rateStrategyStableOne,
  rateStrategyStableTwo,
  rateStrategyVolatileOne,
} from "./rateStrategies";
import { ZERO_ADDRESS } from "../../helpers";
import {
  IAaveConfiguration,
  eEthereumNetwork,
  eArbitrumNetwork,
} from "../../helpers/types";

import { CommonsConfig } from "./commons";
import {
  strategyDAI,
  strategyUSDC,
  strategyAAVE,
  strategyLINK,
  strategyWETH,
} from "./reservesConfigs";

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const AaveMarket: IAaveConfiguration = {
  ...CommonsConfig,
  MarketId: "Testnet Aave Market",
  ProviderId: 8080,
  ReservesConfig: {
    AAVE: strategyAAVE,
    DAI: strategyDAI,
    USDC: strategyUSDC,
    WETH: strategyWETH,
    LINK: strategyLINK,
  },
  ReserveAssets: {
    [eEthereumNetwork.main]: {
      AAVE: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    [eEthereumNetwork.kovan]: {
      AAVE: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      LINK: ZERO_ADDRESS,
    },
    [eArbitrumNetwork.arbitrumTestnet]: {
      AAVE: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      LINK: ZERO_ADDRESS,
    },
    [eEthereumNetwork.rinkeby]: {
      AAVE: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      LINK: ZERO_ADDRESS,
    },
  },
};

export default AaveMarket;
