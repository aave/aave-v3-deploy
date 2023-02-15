import { ZERO_ADDRESS } from "../../helpers";
import {
  IAaveConfiguration,
  eEthereumNetwork,
  eArbitrumNetwork,
} from "../../helpers/types";

import { CommonsConfig } from "./commons";
import {
  strategyWBTC,
  strategyUSDC,
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
    WBTC: strategyWBTC,
    USDC: strategyUSDC,
    WETH: strategyWETH,
  },
  ReserveAssets: {
    [eEthereumNetwork.main]: {
      WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    [eEthereumNetwork.kovan]: {
      WBTC: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
    },
    [eArbitrumNetwork.arbitrumTestnet]: {
      WBTC: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
    },
    [eEthereumNetwork.rinkeby]: {
      WBTC: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
    },
  },
};

export default AaveMarket;
