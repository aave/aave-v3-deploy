"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETHERSCAN_KEY = exports.DETERMINISTIC_DEPLOYMENT = exports.DETERMINISTIC_FACTORIES = exports.hardhatNetworkSettings = exports.getCommonNetworkConfig = exports.loadTasks = exports.buildForkConfig = exports.LIVE_NETWORKS = exports.NETWORKS_RPC_URL = exports.getAlchemyKey = exports.FORK_BLOCK_NUMBER = exports.FORK = exports.TENDERLY_FORK_ID = exports.ALCHEMY_KEY = exports.INFURA_KEY = exports.DEFAULT_GAS_PRICE = exports.DEFAULT_BLOCK_GAS_LIMIT = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const types_1 = require("./types");
require("dotenv").config();
exports.DEFAULT_BLOCK_GAS_LIMIT = 12450000;
exports.DEFAULT_GAS_PRICE = 8000000000;
exports.INFURA_KEY = process.env.INFURA_KEY || "";
exports.ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";
exports.TENDERLY_FORK_ID = process.env.TENDERLY_FORK_ID || "";
exports.FORK = (process.env.FORK || "");
exports.FORK_BLOCK_NUMBER = process.env.FORK_BLOCK_NUMBER
    ? parseInt(process.env.FORK_BLOCK_NUMBER)
    : 0;
const MNEMONIC_PATH = "m/44'/60'/0'/0";
const MNEMONIC = process.env.MNEMONIC || "";
const getAlchemyKey = (net) => {
    switch (net) {
        case types_1.eEthereumNetwork.kovan:
            return process.env.KOVAN_ALCHEMY_KEY || exports.ALCHEMY_KEY;
        case types_1.eEthereumNetwork.main:
            return process.env.MAIN_ALCHEMY_KEY || exports.ALCHEMY_KEY;
        case types_1.eOptimismNetwork.main:
            return process.env.OPTIMISM_ALCHEMY_KEY || exports.ALCHEMY_KEY;
        case types_1.eOptimismNetwork.testnet:
            return process.env.KOVAN_OPTIMISM_ALCHEMY_KEY || exports.ALCHEMY_KEY;
        case types_1.eEthereumNetwork.rinkeby:
            return process.env.RINKEBY_ALCHEMY_KEY || exports.ALCHEMY_KEY;
        case types_1.ePolygonNetwork.mumbai:
            return process.env.POLYGON_MUMBAI_ALCHEMY_KEY || exports.ALCHEMY_KEY;
        case types_1.ePolygonNetwork.polygon:
            return process.env.POLYGON_ALCHEMY_KEY || exports.ALCHEMY_KEY;
        case types_1.eEthereumNetwork.goerli:
            return process.env.GOERLI_ALCHEMY_KEY || exports.ALCHEMY_KEY;
        default:
            return exports.ALCHEMY_KEY;
    }
};
exports.getAlchemyKey = getAlchemyKey;
exports.NETWORKS_RPC_URL = {
    [types_1.eEthereumNetwork.kovan]: `https://eth-kovan.alchemyapi.io/v2/${(0, exports.getAlchemyKey)(types_1.eEthereumNetwork.kovan)}`,
    [types_1.eEthereumNetwork.main]: `https://eth-mainnet.alchemyapi.io/v2/${(0, exports.getAlchemyKey)(types_1.eEthereumNetwork.main)}`,
    [types_1.eEthereumNetwork.coverage]: "http://localhost:8555",
    [types_1.eEthereumNetwork.hardhat]: "http://localhost:8545",
    [types_1.ePolygonNetwork.mumbai]: `https://polygon-mumbai.g.alchemy.com/v2/${(0, exports.getAlchemyKey)(types_1.ePolygonNetwork.mumbai)}`,
    [types_1.ePolygonNetwork.polygon]: `https://polygon-mainnet.g.alchemy.com/v2/${(0, exports.getAlchemyKey)(types_1.ePolygonNetwork.polygon)}`,
    [types_1.eArbitrumNetwork.arbitrum]: `https://arb1.arbitrum.io/rpc`,
    [types_1.eArbitrumNetwork.arbitrumTestnet]: `https://rinkeby.arbitrum.io/rpc`,
    [types_1.eEthereumNetwork.rinkeby]: `https://eth-rinkeby.alchemyapi.io/v2/${(0, exports.getAlchemyKey)(types_1.eEthereumNetwork.rinkeby)}`,
    [types_1.eEthereumNetwork.ropsten]: `https://eth-ropsten.alchemyapi.io/v2/${(0, exports.getAlchemyKey)(types_1.eEthereumNetwork.ropsten)}`,
    [types_1.eHarmonyNetwork.main]: `https://a.api.s0.t.hmny.io/`,
    [types_1.eHarmonyNetwork.testnet]: `https://api.s0.b.hmny.io`,
    [types_1.eAvalancheNetwork.avalanche]: "https://api.avax.network/ext/bc/C/rpc",
    [types_1.eAvalancheNetwork.fuji]: "https://api.avax-test.network/ext/bc/C/rpc",
    [types_1.eFantomNetwork.main]: "https://rpc.ftm.tools/",
    [types_1.eFantomNetwork.testnet]: "https://rpc.testnet.fantom.network/",
    [types_1.eOptimismNetwork.testnet]: `https://opt-goerli.g.alchemy.com/v2/demo`,
    [types_1.eOptimismNetwork.main]: `https://mainnet.optimism.io`,
    tenderly: `https://rpc.tenderly.co/fork/${exports.TENDERLY_FORK_ID}`,
    [types_1.eEthereumNetwork.goerli]: `https://eth-goerli.alchemyapi.io/v2/${(0, exports.getAlchemyKey)(types_1.eEthereumNetwork.goerli)}`,
    [types_1.eArbitrumNetwork.goerliNitro]: `https://goerli-rollup.arbitrum.io/rpc`,
};
exports.LIVE_NETWORKS = {
    [types_1.eEthereumNetwork.main]: true,
    [types_1.ePolygonNetwork.polygon]: true,
    [types_1.eArbitrumNetwork.arbitrum]: true,
    [types_1.eHarmonyNetwork.main]: true,
    [types_1.eAvalancheNetwork.avalanche]: true,
    [types_1.eFantomNetwork.main]: true,
    [types_1.eOptimismNetwork.main]: true,
};
const GAS_PRICE_PER_NET = {
    [types_1.eArbitrumNetwork.goerliNitro]: 100000001,
};
const buildForkConfig = () => {
    let forkMode;
    if (exports.FORK && exports.NETWORKS_RPC_URL[exports.FORK]) {
        forkMode = {
            url: exports.NETWORKS_RPC_URL[exports.FORK],
        };
        if (exports.FORK_BLOCK_NUMBER) {
            forkMode.blockNumber = exports.FORK_BLOCK_NUMBER;
        }
    }
    return forkMode;
};
exports.buildForkConfig = buildForkConfig;
const loadTasks = (taskFolders) => taskFolders.forEach((folder) => {
    const tasksPath = path_1.default.join(__dirname, "../tasks", folder);
    fs_1.default.readdirSync(tasksPath)
        .filter((pth) => pth.includes(".ts") || pth.includes(".js"))
        .forEach((task) => {
        require(`${tasksPath}/${task}`);
    });
});
exports.loadTasks = loadTasks;
const getCommonNetworkConfig = (networkName, chainId) => ({
    url: exports.NETWORKS_RPC_URL[networkName] || "",
    blockGasLimit: exports.DEFAULT_BLOCK_GAS_LIMIT,
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
    live: exports.LIVE_NETWORKS[networkName] || false,
});
exports.getCommonNetworkConfig = getCommonNetworkConfig;
const MNEMONICS = {
    [types_1.eAvalancheNetwork.fuji]: process.env.FUJI_MNEMONIC,
    [types_1.eFantomNetwork.testnet]: process.env.FANTOM_MNEMONIC,
    [types_1.eHarmonyNetwork.testnet]: process.env.HARMONY_MNEMONIC,
    [types_1.eArbitrumNetwork.arbitrumTestnet]: process.env.ARBITRUM_MNEMONIC,
    [types_1.ePolygonNetwork.mumbai]: process.env.POLYGON_MUMBAI_MNEMONIC,
    [types_1.ePolygonNetwork.polygon]: process.env.POLYGON_MNEMONIC,
};
exports.hardhatNetworkSettings = {
    gasPrice: "auto",
    initialBaseFeePerGas: "0",
    blockGasLimit: exports.DEFAULT_BLOCK_GAS_LIMIT,
    throwOnTransactionFailures: true,
    throwOnCallFailures: true,
    chainId: 31337,
    forking: (0, exports.buildForkConfig)(),
    saveDeployments: true,
    allowUnlimitedContractSize: true,
    tags: ["local"],
    accounts: exports.FORK && !!MNEMONIC
        ? {
            mnemonic: MNEMONIC,
            path: MNEMONIC_PATH,
            initialIndex: 0,
            count: 10,
        }
        : undefined,
};
exports.DETERMINISTIC_FACTORIES = {
    "1": {
        funding: "2500000000000000",
        deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
        factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
        signedTx: "0xf8a5808505d21dba00830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf325a0efde12f74fb41030a44b3fd8df0f454770dfb43f6662ade8d2cfff27d33b7583a06d9897209d00096273b45caf45fd2b5f810f9532d6725833d7eeb330d906cee5",
    },
    "10": {
        funding: "100000000000",
        deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
        factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
        signedTx: "0xf8a380830f4240830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf337a06b48dc85053031af9928fefeb04df16535baf75bf329dcde39b0626de9334891a0319974b3e9f246138213887ffbdf06fa5e6210696055cafe7f4e2811d9850ad8",
    },
    "137": {
        funding: "7000000000000000",
        deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
        factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
        signedTx: "0xf8a78085104c533c00830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820135a0b930ddeea99c27453b75662cc1d0ca48024d3ba2f430b0bb2a072b41c6e9be18a01983c4ca8005197daa1664cc2111267e1c2898ec830055f0c8031b669beabb75",
    },
    "250": {
        funding: "150000000000000000",
        deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
        factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
        signedTx: "0xf8a88086015d3ef79800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820217a0ca245f126ca3c4052a76c4a562d96f5290bfbe07dc110d1a072907bada8cda17a014a9d1fa421f5f7d4c51c01f11538a2dd641fa48dbb2b1eb3ca11a446a990c1e",
    },
    "31337": {
        funding: "100000000000000",
        deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
        factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
        signedTx: "0xf8a680843b9aca00830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf382f4f6a0a306cd60a84b884af0d1040e7f00e694fba8e3d250d978422b8a3dccd40886b1a03a35469d022c4612457e7dc583cbaf698aa82d2e624e43e51deb2a3cb4612df1",
    },
    "42161": {
        funding: "1000000000000000",
        deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
        factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
        signedTx: "0xf8a780843b9aca00830f42408080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf383014986a0a5e077f50f504d7f7b0770794dcab9f6cc0aac35923e612029b635d64b4d1d11a06e3b5b0e20f0b1478d53c7e9cb961787d4ca96a9d1b973c9b8424163c2ba66b9",
    },
    "43114": {
        funding: "3500000000000000",
        deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
        factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
        signedTx: "0xf8a880850826299e00830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3830150f8a02fb12e72c3e25d707bc13df978921914d1e603da746d9251d65fa6e7457b15aaa06993c43ab3f581882dc5849489f6232c40c47210320e31f54263989f9e6ab180",
    },
    "1666600000": {
        funding: "3000000000000000",
        deployer: "0xAE0b890a625A87C23A1fccDEFb4C26A798719f17",
        factory: "0x2401ae9bBeF67458362710f90302Eb52b5Ce835a",
        signedTx: "0xf8a9808506fc23ac00830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf384c6ac98a3a04ccc5a1ad667b68cdf1b43b3a5b82a25df1a4ac3c8fbac09950f888174c422bda0746ee83b93a6d1663b17829e4b817e92108985d0f58f781bcda7acdbe7b6b079",
    },
};
exports.DETERMINISTIC_DEPLOYMENT = process.env.DETERMINISTIC_DEPLOYMENT
    ? process.env.DETERMINISTIC_DEPLOYMENT === "true"
    : null;
exports.ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || "";
