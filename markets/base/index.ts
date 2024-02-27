import { eBaseNetwork, IAaveConfiguration } from "./../../helpers/types";
import AaveMarket from "../aave";
import { ZERO_ADDRESS } from "../../helpers";
import {
  strategyUSDC,
  strategyWETH,
  strategyCBETH,
} from "../aave/reservesConfigs";

export const BaseConfig: IAaveConfiguration = {
  ...AaveMarket,
  MarketId: "Base Aave Market",
  ATokenNamePrefix: "Base",
  StableDebtTokenNamePrefix: "Base",
  VariableDebtTokenNamePrefix: "Base",
  SymbolPrefix: "Base",
  ProviderId: 37,
  ReservesConfig: {
    USDC: strategyUSDC,
    WETH: strategyWETH,
    CBETH: strategyCBETH,
  },
  ReserveAssets: {
    [eBaseNetwork.base]: {
      USDC: "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca", // usdbc
      WETH: "0x4200000000000000000000000000000000000006",
      CBETH: "0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22",
    },
    [eBaseNetwork.baseGoerli]: {
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      CBETH: ZERO_ADDRESS,
    },
  },
  EModes: {},
  ChainlinkAggregator: {
    [eBaseNetwork.base]: {
      USDC: "0x7e860098f58bbfc8648a4311b374b1d669a2bc6b",
      WETH: "0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70",
      CBETH: "0xd7818272b9e248357d13057aab0b417af31e817d",
    },
  },
};

export default BaseConfig;
