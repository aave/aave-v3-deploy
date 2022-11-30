import { IAaveConfiguration } from "../../helpers/types";
import { AaveMarket } from "../aave/index";

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const EthereumV3Market: IAaveConfiguration = {
  ...AaveMarket,
  ProviderId: 30,
  WrappedNativeTokenSymbol: "WETH",
  MarketId: "Aave Ethereum Market",
  ATokenNamePrefix: "Ethereum",
  StableDebtTokenNamePrefix: "Ethereum",
  VariableDebtTokenNamePrefix: "Ethereum",
  SymbolPrefix: "Eth",
  ReserveAssets: {},
  ChainlinkAggregator: {},
  ReservesConfig: {},
  EModes: {},
};

export default EthereumV3Market;
