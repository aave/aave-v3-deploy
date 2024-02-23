import fs from "fs";
import path from "path";
import { HardhatNetworkForkingUserConfig } from "hardhat/types";
import {
  iParamsPerNetwork,
  eEthereumNetwork,
  eNetwork,
  ePolygonNetwork,
  eArbitrumNetwork,
  eHarmonyNetwork,
  eAvalancheNetwork,
  eFantomNetwork,
  eOptimismNetwork,
  eBaseNetwork,
} from "./types";

require("dotenv").config();

export const DEFAULT_BLOCK_GAS_LIMIT = 12450000;
export const DEFAULT_GAS_PRICE = 8000000000;
export const INFURA_KEY = process.env.INFURA_KEY || "";
export const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";
export const TENDERLY_FORK_ID = process.env.TENDERLY_FORK_ID || "";
export const FORK = (process.env.FORK || "") as eNetwork;
export const FORK_BLOCK_NUMBER = process.env.FORK_BLOCK_NUMBER
  ? parseInt(process.env.FORK_BLOCK_NUMBER)
  : 0;
const MNEMONIC_PATH = "m/44'/60'/0'/0";
const MNEMONIC = process.env.MNEMONIC || "";

export const getAlchemyKey = (net: eNetwork) => {
  switch (net) {
    case eEthereumNetwork.kovan:
      return process.env.KOVAN_ALCHEMY_KEY || ALCHEMY_KEY;
    case eEthereumNetwork.main:
      return process.env.MAIN_ALCHEMY_KEY || ALCHEMY_KEY;
    case eOptimismNetwork.main:
      return process.env.OPTIMISM_ALCHEMY_KEY || ALCHEMY_KEY;
    case eOptimismNetwork.testnet:
      return process.env.KOVAN_OPTIMISM_ALCHEMY_KEY || ALCHEMY_KEY;
    case eEthereumNetwork.rinkeby:
      return process.env.RINKEBY_ALCHEMY_KEY || ALCHEMY_KEY;
    case ePolygonNetwork.mumbai:
      return process.env.POLYGON_MUMBAI_ALCHEMY_KEY || ALCHEMY_KEY;
    case ePolygonNetwork.polygon:
      return process.env.POLYGON_ALCHEMY_KEY || ALCHEMY_KEY;
    case eEthereumNetwork.goerli:
      return process.env.GOERLI_ALCHEMY_KEY || ALCHEMY_KEY;
    case eEthereumNetwork.sepolia:
      return process.env.SEPOLIA_ALCHEMY_KEY || ALCHEMY_KEY;
    case eBaseNetwork.base:
      return process.env.BASE_ALCHEMY_KEY || ALCHEMY_KEY;
    default:
      return ALCHEMY_KEY;
  }
};

export const NETWORKS_RPC_URL: iParamsPerNetwork<string> = {
  [eEthereumNetwork.kovan]: `https://eth-kovan.alchemyapi.io/v2/${getAlchemyKey(
    eEthereumNetwork.kovan
  )}`,
  [eEthereumNetwork.main]: `https://eth-mainnet.alchemyapi.io/v2/${getAlchemyKey(
    eEthereumNetwork.main
  )}`,
  [eEthereumNetwork.coverage]: "http://localhost:8555",
  [eEthereumNetwork.hardhat]: "http://localhost:8545",
  [ePolygonNetwork.mumbai]: `https://polygon-mumbai.g.alchemy.com/v2/${getAlchemyKey(
    ePolygonNetwork.mumbai
  )}`,
  [ePolygonNetwork.polygon]: `https://polygon-mainnet.g.alchemy.com/v2/${getAlchemyKey(
    ePolygonNetwork.polygon
  )}`,
  [eArbitrumNetwork.arbitrum]: `https://arb1.arbitrum.io/rpc`,
  [eArbitrumNetwork.arbitrumTestnet]: `https://rinkeby.arbitrum.io/rpc`,
  [eEthereumNetwork.rinkeby]: `https://eth-rinkeby.alchemyapi.io/v2/${getAlchemyKey(
    eEthereumNetwork.rinkeby
  )}`,
  [eEthereumNetwork.ropsten]: `https://eth-ropsten.alchemyapi.io/v2/${getAlchemyKey(
    eEthereumNetwork.ropsten
  )}`,
  [eHarmonyNetwork.main]: `https://a.api.s0.t.hmny.io/`,
  [eHarmonyNetwork.testnet]: `https://api.s0.b.hmny.io`,
  [eAvalancheNetwork.avalanche]: "https://api.avax.network/ext/bc/C/rpc",
  [eAvalancheNetwork.fuji]: "https://api.avax-test.network/ext/bc/C/rpc",
  [eFantomNetwork.main]: "https://rpc.ftm.tools/",
  [eFantomNetwork.testnet]: "https://rpc.testnet.fantom.network/",
  [eOptimismNetwork.testnet]: `https://opt-goerli.g.alchemy.com/v2/demo`,
  [eOptimismNetwork.main]: `https://mainnet.optimism.io`,
  tenderly: `https://rpc.tenderly.co/fork/${TENDERLY_FORK_ID}`,
  [eEthereumNetwork.goerli]: `https://eth-goerli.alchemyapi.io/v2/${getAlchemyKey(
    eEthereumNetwork.goerli
  )}`,
  [eEthereumNetwork.sepolia]: `https://eth-sepolia.g.alchemy.com/v2/${getAlchemyKey(
    eEthereumNetwork.sepolia
  )}`,
  [eArbitrumNetwork.goerliNitro]: `https://goerli-rollup.arbitrum.io/rpc`,
  [eBaseNetwork.baseGoerli]: `https://goerli.base.org`,
  [eBaseNetwork.base]: `https://base-mainnet.g.alchemy.com/v2/${getAlchemyKey(
    eBaseNetwork.base
  )}`,
};

export const LIVE_NETWORKS: iParamsPerNetwork<boolean> = {
  [eEthereumNetwork.main]: true,
  [ePolygonNetwork.polygon]: true,
  [eArbitrumNetwork.arbitrum]: true,
  [eHarmonyNetwork.main]: true,
  [eAvalancheNetwork.avalanche]: true,
  [eFantomNetwork.main]: true,
  [eOptimismNetwork.main]: true,
  [eBaseNetwork.base]: true,
};

const GAS_PRICE_PER_NET: iParamsPerNetwork<string | number> = {
  [eArbitrumNetwork.goerliNitro]: 100000001,
  [eBaseNetwork.baseGoerli]: 8000000000,
};

export const buildForkConfig = ():
  | HardhatNetworkForkingUserConfig
  | undefined => {
  let forkMode: HardhatNetworkForkingUserConfig | undefined;
  if (FORK && NETWORKS_RPC_URL[FORK]) {
    forkMode = {
      url: NETWORKS_RPC_URL[FORK] as string,
    };
    if (FORK_BLOCK_NUMBER) {
      forkMode.blockNumber = FORK_BLOCK_NUMBER;
    }
  }
  return forkMode;
};

export const loadTasks = (taskFolders: string[]): void =>
  taskFolders.forEach((folder) => {
    const tasksPath = path.join(__dirname, "../tasks", folder);
    fs.readdirSync(tasksPath)
      .filter((pth) => pth.includes(".ts") || pth.includes(".js"))
      .forEach((task) => {
        require(`${tasksPath}/${task}`);
      });
  });

export const getCommonNetworkConfig = (
  networkName: eNetwork,
  chainId?: number
) => ({
  url: NETWORKS_RPC_URL[networkName] || "",
  blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
  chainId,
  gasPrice: GAS_PRICE_PER_NET[networkName] || undefined,
  ...((!!MNEMONICS[networkName] || !!MNEMONIC) && {
    accounts: {
      mnemonic: MNEMONICS[networkName] || MNEMONIC,
      path: MNEMONIC_PATH,
      initialIndex: 0,
      count: 10,
    },
  }),
  live: LIVE_NETWORKS[networkName] || false,
});

const MNEMONICS: iParamsPerNetwork<string> = {
  [eAvalancheNetwork.fuji]: process.env.FUJI_MNEMONIC,
  [eFantomNetwork.testnet]: process.env.FANTOM_MNEMONIC,
  [eHarmonyNetwork.testnet]: process.env.HARMONY_MNEMONIC,
  [eArbitrumNetwork.arbitrumTestnet]: process.env.ARBITRUM_MNEMONIC,
  [ePolygonNetwork.mumbai]: process.env.POLYGON_MUMBAI_MNEMONIC,
  [ePolygonNetwork.polygon]: process.env.POLYGON_MNEMONIC,
};

export const hardhatNetworkSettings = {
  gasPrice: "auto",
  initialBaseFeePerGas: "0",
  blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
  throwOnTransactionFailures: true,
  throwOnCallFailures: true,
  chainId: 31337,
  forking: buildForkConfig(),
  saveDeployments: true,
  allowUnlimitedContractSize: true,
  tags: ["local"],
  accounts:
    FORK && !!MNEMONIC
      ? {
          mnemonic: MNEMONIC,
          path: MNEMONIC_PATH,
          initialIndex: 0,
          count: 10,
        }
      : undefined,
};

export const DETERMINISTIC_FACTORIES = {
  "1": {
    funding: "2500000000000000",
    deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
    factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
    signedTx:
      "0xf8a5808505d21dba00830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf325a0efde12f74fb41030a44b3fd8df0f454770dfb43f6662ade8d2cfff27d33b7583a06d9897209d00096273b45caf45fd2b5f810f9532d6725833d7eeb330d906cee5",
  },
  "10": {
    funding: "100000000000",
    deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
    factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
    signedTx:
      "0xf8a380830f4240830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf337a06b48dc85053031af9928fefeb04df16535baf75bf329dcde39b0626de9334891a0319974b3e9f246138213887ffbdf06fa5e6210696055cafe7f4e2811d9850ad8",
  },
  "137": {
    funding: "7000000000000000",
    deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
    factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
    signedTx:
      "0xf8a78085104c533c00830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820135a0b930ddeea99c27453b75662cc1d0ca48024d3ba2f430b0bb2a072b41c6e9be18a01983c4ca8005197daa1664cc2111267e1c2898ec830055f0c8031b669beabb75",
  },
  "250": {
    funding: "150000000000000000",
    deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
    factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
    signedTx:
      "0xf8a88086015d3ef79800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820217a0ca245f126ca3c4052a76c4a562d96f5290bfbe07dc110d1a072907bada8cda17a014a9d1fa421f5f7d4c51c01f11538a2dd641fa48dbb2b1eb3ca11a446a990c1e",
  },
  "31337": {
    funding: "100000000000000",
    deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
    factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
    signedTx:
      "0xf8a680843b9aca00830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf382f4f6a0a306cd60a84b884af0d1040e7f00e694fba8e3d250d978422b8a3dccd40886b1a03a35469d022c4612457e7dc583cbaf698aa82d2e624e43e51deb2a3cb4612df1",
  },
  "42161": {
    funding: "1000000000000000",
    deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
    factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
    signedTx:
      "0xf8a780843b9aca00830f42408080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf383014986a0a5e077f50f504d7f7b0770794dcab9f6cc0aac35923e612029b635d64b4d1d11a06e3b5b0e20f0b1478d53c7e9cb961787d4ca96a9d1b973c9b8424163c2ba66b9",
  },
  "43114": {
    funding: "3500000000000000",
    deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
    factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
    signedTx:
      "0xf8a880850826299e00830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3830150f8a02fb12e72c3e25d707bc13df978921914d1e603da746d9251d65fa6e7457b15aaa06993c43ab3f581882dc5849489f6232c40c47210320e31f54263989f9e6ab180",
  },
  "1666600000": {
    funding: "3000000000000000",
    deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
    factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
    signedTx:
      "0xf8a9808506fc23ac00830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf384c6ac98a3a04ccc5a1ad667b68cdf1b43b3a5b82a25df1a4ac3c8fbac09950f888174c422bda0746ee83b93a6d1663b17829e4b817e92108985d0f58f781bcda7acdbe7b6b079",
  },
};

export const DETERMINISTIC_DEPLOYMENT = process.env.DETERMINISTIC_DEPLOYMENT
  ? process.env.DETERMINISTIC_DEPLOYMENT === "true"
  : null;

export const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || "";
