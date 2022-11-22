import { eOptimismNetwork } from "./../../helpers/types";
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
  strategyWBTC,
  strategyWETH,
  strategyUSDT,
  strategyEURS,
} from "./reservesConfigs";

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const AaveMarket: IAaveConfiguration = {
  ...CommonsConfig,
  MarketId: "Ethereum Aave Market",
  ATokenNamePrefix: "Ethereum",
  StableDebtTokenNamePrefix: "Ethereum",
  VariableDebtTokenNamePrefix: "Ethereum",
  SymbolPrefix: "Eth",
  ProviderId: 30,
  ReservesConfig: {
    DAI: strategyDAI,
    LINK: strategyLINK,
    USDC: strategyUSDC,
    WBTC: strategyWBTC,
    WETH: strategyWETH,
    USDT: strategyUSDT,
    AAVE: strategyAAVE,
    EURS: strategyEURS,
  },
  ReserveAssets: {
    [eEthereumNetwork.main]: {
      DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      AAVE: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      EURS: "0xdb25f211ab05b1c97d595516f45794528a807ad8",
    },
    [eEthereumNetwork.rinkeby]: {
      AAVE: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
      LINK: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
      EURS: ZERO_ADDRESS,
    },
  },
  StkAaveProxy: {
    [eEthereumNetwork.main]: "0x4da27a545c0c5B758a6BA100e3a049001de870f5",
  },
};

export default AaveMarket;
