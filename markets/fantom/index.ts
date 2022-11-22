import { eFantomNetwork, IAaveConfiguration } from "../../helpers/types";
import { AaveMarket } from "../aave/index";
import {
  strategyDAI,
  strategyUSDT,
  strategyWETH,
} from "../aave/reservesConfigs";
import { ZERO_ADDRESS } from "../../helpers/constants";
import {
  strategyAAVE,
  strategyLINK,
  strategyUSDC,
  strategyWBTC,
  strategyWFTM,
  strategyCRV,
  strategySUSHI,
} from "./reservesConfigs";
// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const FantomMarket: IAaveConfiguration = {
  ...AaveMarket,
  ProviderId: 33,
  WrappedNativeTokenSymbol: "WFTM",
  MarketId: "Fantom Aave Market",
  ATokenNamePrefix: "Fantom",
  StableDebtTokenNamePrefix: "Fantom",
  VariableDebtTokenNamePrefix: "Fantom",
  SymbolPrefix: "Fan",
  ReservesConfig: {
    DAI: strategyDAI,
    LINK: strategyLINK,
    USDC: strategyUSDC,
    WBTC: strategyWBTC,
    WETH: strategyWETH,
    USDT: strategyUSDT,
    AAVE: strategyAAVE,
    WFTM: strategyWFTM,
    CRV: strategyCRV,
    SUSHI: strategySUSHI,
  },
  ReserveAssets: {
    [eFantomNetwork.main]: {
      DAI: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
      LINK: "0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8",
      USDC: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
      WBTC: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
      WETH: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
      USDT: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
      AAVE: "0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B",
      WFTM: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
      SUSHI: "0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC",
      CRV: "0x1E4F97b9f9F913c46F1632781732927B9019C68b",
    },
    [eFantomNetwork.testnet]: {
      AAVE: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
      LINK: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
      WFTM: ZERO_ADDRESS,
    },
  },
  ChainlinkAggregator: {
    [eFantomNetwork.main]: {
      AAVE: "0xE6ecF7d2361B6459cBb3b4fb065E0eF4B175Fe74",
      DAI: "0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52",
      LINK: "0x221C773d8647BC3034e91a0c47062e26D20d97B4",
      USDC: "0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c",
      WBTC: "0x8e94C22142F4A64b99022ccDd994f4e9EC86E4B4",
      WETH: "0x11DdD3d147E5b83D01cee7070027092397d63658",
      USDT: "0xF64b636c5dFe1d3555A847341cDC449f612307d0",
      WFTM: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc",
      SUSHI: "0xCcc059a1a17577676c8673952Dc02070D29e5a66",
      CRV: "0xa141D7E3B44594cc65142AE5F2C7844Abea66D2B",
    },
  },
  EModes: {
    StableEMode: {
      id: "1",
      ltv: "9700",
      liquidationThreshold: "9750",
      liquidationBonus: "10100",
      label: "Stablecoins",
      assets: ["USDC", "USDT", "DAI"],
    },
  },
};

export default FantomMarket;
