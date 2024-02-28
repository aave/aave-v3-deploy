import {
  IAaveConfiguration,
  eEthereumNetwork,
} from "../../helpers/types";

import { CommonsConfig } from "./commons";
import {
  strategyUSDC,
  strategyWETH,
} from "./reservesConfigs";

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const SizeVariablePoolMarket: IAaveConfiguration = {
  ...CommonsConfig,
  MarketId: "Size Variable Pool Market",
  ATokenNamePrefix: "",
  StableDebtTokenNamePrefix: "",
  VariableDebtTokenNamePrefix: "",
  SymbolPrefix: "",
  ProviderId: 314159265,
  ReservesConfig: {
    USDC: strategyUSDC,
    WETH: strategyWETH,
  },
  ReserveAssets: {
    [eEthereumNetwork.main]: {
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    [eEthereumNetwork.sepolia]: {
      USDC: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
      WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    },
  },
  StkAaveProxy: {
  },
};

export default SizeVariablePoolMarket;
