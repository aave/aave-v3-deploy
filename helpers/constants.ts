import { parseEther, parseUnits } from "ethers/lib/utils";
import {
  eArbitrumNetwork,
  eAvalancheNetwork,
  eBaseNetwork,
  eEthereumNetwork,
  eFantomNetwork,
  eHarmonyNetwork,
  eOptimismNetwork,
  ePolygonNetwork,
} from "./types";

const {
  version: coreVersion,
}: {
  version: string;
} = require("@aave/core-v3/package.json");
const {
  version: peripheryVersion,
}: {
  _resolved: string;
  version: string;
} = require("@aave/periphery-v3/package.json");

export const V3_CORE_VERSION = coreVersion;
export const V3_PERIPHERY_VERSION = peripheryVersion;

export const PERCENTAGE_FACTOR = "10000";
export const HALF_PERCENTAGE = "5000";
export const oneEther = parseEther("1");
export const oneRay = parseUnits("1", 27);
export const MAX_UINT_AMOUNT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const ONE_ADDRESS = "0x0000000000000000000000000000000000000001";
export const AAVE_REFERRAL = "0";

export const WRAPPED_NATIVE_TOKEN_PER_NETWORK: { [network: string]: string } = {
  [eEthereumNetwork.kovan]: ZERO_ADDRESS,
  [eEthereumNetwork.main]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  [eArbitrumNetwork.arbitrum]: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  [eArbitrumNetwork.arbitrumTestnet]:
    "0x8592a357252606f5cA2897BD4f500201F7245C28",
  [eOptimismNetwork.main]: "0x4200000000000000000000000000000000000006",
  [eAvalancheNetwork.avalanche]: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  [eFantomNetwork.main]: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
  [eHarmonyNetwork.main]: "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
  [ePolygonNetwork.polygon]: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
};

export const ZERO_BYTES_32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const MOCK_CHAINLINK_AGGREGATORS_PRICES: { [key: string]: string } = {
  AAVE: parseUnits("300", 8).toString(),
  WETH: parseUnits("4000", 8).toString(),
  ETH: parseUnits("4000", 8).toString(),
  DAI: parseUnits("1", 8).toString(),
  USDC: parseUnits("1", 8).toString(),
  USDT: parseUnits("1", 8).toString(),
  WBTC: parseUnits("60000", 8).toString(),
  USD: parseUnits("1", 8).toString(),
  LINK: parseUnits("30", 8).toString(),
  CRV: parseUnits("6", 8).toString(),
  BAL: parseUnits("19.70", 8).toString(),
  REW: parseUnits("1", 8).toString(),
  EURS: parseUnits("1.126", 8).toString(),
  ONE: parseUnits("0.28", 8).toString(),
  WONE: parseUnits("0.28", 8).toString(),
  WAVAX: parseUnits("86.59", 8).toString(),
  WFTM: parseUnits("2.42", 8).toString(),
  WMATIC: parseUnits("1.40", 8).toString(),
  SUSD: parseUnits("1", 8).toString(),
  SUSHI: parseUnits("2.95", 8).toString(),
  GHST: parseUnits("2.95", 8).toString(),
  AGEUR: parseUnits("1.126", 8).toString(),
  JEUR: parseUnits("1.126", 8).toString(),
  DPI: parseUnits("149", 8).toString(),
  CBETH: parseUnits("4000", 8).toString(),
};

export const chainlinkAggregatorProxy: Record<string, string> = {
  main: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  kovan: "0x9326BFA02ADD2366b30bacB125260Af641031331",
  polygon: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
  mumbai: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
  avalanche: "0x0A77230d17318075983913bC2145DB16C7366156",
  fuji: "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD",
  tenderly: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  arbitrum: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
  "arbitrum-testnet": "0x5f0423B1a6935dc5596e7A24d98532b67A0AeFd8",
  rinkeby: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  harmony: "0xdCD81FbbD6c4572A69a534D8b8152c562dA8AbEF",
  optimism: "0xA969bEB73d918f6100163Cd0fba3C586C269bee1",
  fantom: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc",
  "harmony-testnet": "0xcEe686F89bc0dABAd95AEAAC980aE1d97A075FAD",
  "optimism-testnet": "0xEFFC18fC3b7eb8E676dac549E0c693ad50D1Ce31",
  "fantom-testnet": "0xe04676B9A9A2973BCb0D1478b5E1E9098BBB7f3D",
  ropsten: "0x12BAaa24D85A4A180F0d5ae67b6aCbDDD58968EA",
  goerli: "0x60E4B131f0F219c72b0346675283E73888e4AB24",
  [eArbitrumNetwork.goerliNitro]: "0xC09e69E79106861dF5d289dA88349f10e2dc6b5C",
  [eEthereumNetwork.sepolia]: "0x6c60d915c7a646860dba836ffcb7f112b6cfdc76",
};

export const chainlinkEthUsdAggregatorProxy: Record<string, string> = {
  main: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  kovan: "0x9326BFA02ADD2366b30bacB125260Af641031331",
  polygon: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  mumbai: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
  avalanche: "0x976B3D034E162d8bD72D6b9C989d545b839003b0",
  fuji: "0x86d67c3D38D2bCeE722E601025C25a575021c6EA",
  tenderly: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  arbitrum: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
  "arbitrum-testnet": "0x5f0423B1a6935dc5596e7A24d98532b67A0AeFd8",
  rinkeby: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  harmony: "0xbaf7C8149D586055ed02c286367A41E0aDA96b7C",
  optimism: "0xA969bEB73d918f6100163Cd0fba3C586C269bee1",
  fantom: "0x11DdD3d147E5b83D01cee7070027092397d63658",
  "harmony-testnet": "0x4f11696cE92D78165E1F8A9a4192444087a45b64",
  "optimism-testnet": "0xEFFC18fC3b7eb8E676dac549E0c693ad50D1Ce31",
  "fantom-testnet": "0xB8C458C957a6e6ca7Cc53eD95bEA548c52AFaA24",
  ropsten: "0x12BAaa24D85A4A180F0d5ae67b6aCbDDD58968EA",
  goerli: "0x60E4B131f0F219c72b0346675283E73888e4AB24",
  [eArbitrumNetwork.goerliNitro]: "0xC09e69E79106861dF5d289dA88349f10e2dc6b5C",
  [eEthereumNetwork.sepolia]: "0x6c60d915c7a646860dba836ffcb7f112b6cfdc76",
};

export const ETHEREUM_SHORT_EXECUTOR =
  "0xEE56e2B3D491590B5b31738cC34d5232F378a8D5";

export const EMPTY_STORAGE_SLOT =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const POOL_ADMIN: Record<string, string> = {
  [eArbitrumNetwork.arbitrum]: "0xbbd9f90699c1FA0D7A65870D241DD1f1217c96Eb",
  [eAvalancheNetwork.avalanche]: "0xa35b76E4935449E33C56aB24b23fcd3246f13470",
  [eFantomNetwork.main]: "0x39CB97b105173b56b5a2b4b33AD25d6a50E6c949",
  [eHarmonyNetwork.main]: "0xb2f0C5f37f4beD2cB51C44653cD5D84866BDcd2D",
  [eOptimismNetwork.main]: "0xE50c8C619d05ff98b22Adf991F17602C774F785c",
  [ePolygonNetwork.polygon]: "0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772",
  [eEthereumNetwork.main]: ETHEREUM_SHORT_EXECUTOR,
  [eBaseNetwork.base]: "0xA9F30e6ED4098e9439B2ac8aEA2d3fc26BcEbb45",
  [eBaseNetwork.baseGoerli]: "0xA9F30e6ED4098e9439B2ac8aEA2d3fc26BcEbb45",
  [eEthereumNetwork.tenderly]: ETHEREUM_SHORT_EXECUTOR,
};

export const EMERGENCY_ADMIN: Record<string, string> = {
  [eArbitrumNetwork.arbitrum]: "0xbbd9f90699c1FA0D7A65870D241DD1f1217c96Eb",
  [eAvalancheNetwork.avalanche]: "0xa35b76E4935449E33C56aB24b23fcd3246f13470",
  [eFantomNetwork.main]: "0x39CB97b105173b56b5a2b4b33AD25d6a50E6c949",
  [eHarmonyNetwork.main]: "0xb2f0C5f37f4beD2cB51C44653cD5D84866BDcd2D",
  [eOptimismNetwork.main]: "0xE50c8C619d05ff98b22Adf991F17602C774F785c",
  [ePolygonNetwork.polygon]: "0x1450F2898D6bA2710C98BE9CAF3041330eD5ae58",
  [eEthereumNetwork.main]: ETHEREUM_SHORT_EXECUTOR,
};

export const DEFAULT_NAMED_ACCOUNTS = {
  deployer: {
    default: 0,
  },
  aclAdmin: {
    default: 0,
  },
  emergencyAdmin: {
    default: 0,
  },
  poolAdmin: {
    default: 0,
  },
  addressesProviderRegistryOwner: {
    default: 0,
  },
  treasuryProxyAdmin: {
    default: 1,
  },
  incentivesProxyAdmin: {
    default: 1,
  },
  incentivesEmissionManager: {
    default: 0,
  },
  incentivesRewardsVault: {
    default: 0,
  },
};

export const GOVERNANCE_BRIDGE_EXECUTOR: { [key: string]: string } = {
  [ePolygonNetwork.polygon]: "0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772",
  [eOptimismNetwork.main]: "0x7d9103572bE58FfE99dc390E8246f02dcAe6f611",
  [eArbitrumNetwork.arbitrum]: "0x7d9103572bE58FfE99dc390E8246f02dcAe6f611",
};

export const MULTISIG_ADDRESS: { [key: string]: string } = {
  [eArbitrumNetwork.arbitrum]: "0xbbd9f90699c1FA0D7A65870D241DD1f1217c96Eb",
  [eAvalancheNetwork.avalanche]: "0xa35b76E4935449E33C56aB24b23fcd3246f13470",
  [eFantomNetwork.main]: "0x39CB97b105173b56b5a2b4b33AD25d6a50E6c949",
  [eHarmonyNetwork.main]: "0xb2f0C5f37f4beD2cB51C44653cD5D84866BDcd2D",
  [eOptimismNetwork.main]: "0xE50c8C619d05ff98b22Adf991F17602C774F785c",
  // Polygon Multisig
  [ePolygonNetwork.polygon]: "0x1450F2898D6bA2710C98BE9CAF3041330eD5ae58",
};
