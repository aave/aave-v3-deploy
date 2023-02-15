"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressFromJson = exports.getProxyImplementationBySlot = exports.getProxyAdminBySlot = exports.getWalletBalances = exports.getContract = exports.deployContract = exports.getBlockTimestamp = exports.waitDeployment = exports.parseUnitsFromToken = exports.advanceTimeAndBlock = exports.increaseTime = exports.advanceBlock = exports.evmRevert = exports.evmSnapshot = exports.getCurrentBlock = exports.waitForTx = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bluebird_1 = __importDefault(require("bluebird"));
const utils_1 = require("ethers/lib/utils");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const waitForTx = async (tx) => await tx.wait(1);
exports.waitForTx = waitForTx;
const getCurrentBlock = async () => {
    return (await hre.ethers.provider.getBlock("latest")).number;
};
exports.getCurrentBlock = getCurrentBlock;
const evmSnapshot = async () => await hre.ethers.provider.send("evm_snapshot", []);
exports.evmSnapshot = evmSnapshot;
const evmRevert = async (id) => hre.ethers.provider.send("evm_revert", [id]);
exports.evmRevert = evmRevert;
const advanceBlock = async (timestamp) => await hre.ethers.provider.send("evm_mine", [timestamp]);
exports.advanceBlock = advanceBlock;
const increaseTime = async (secondsToIncrease) => {
    await hre.ethers.provider.send("evm_increaseTime", [secondsToIncrease]);
    await hre.ethers.provider.send("evm_mine", []);
};
exports.increaseTime = increaseTime;
// Workaround for time travel tests bug: https://github.com/Tonyhaenn/hh-time-travel/blob/0161d993065a0b7585ec5a043af2eb4b654498b8/test/test.js#L12
const advanceTimeAndBlock = async function (forwardTime) {
    const currentBlockNumber = await (0, exports.getCurrentBlock)();
    const currentBlock = await hre.ethers.provider.getBlock(currentBlockNumber);
    if (currentBlock === null) {
        /* Workaround for https://github.com/nomiclabs/hardhat/issues/1183
         */
        await hre.ethers.provider.send("evm_increaseTime", [forwardTime]);
        await hre.ethers.provider.send("evm_mine", []);
        //Set the next blocktime back to 15 seconds
        await hre.ethers.provider.send("evm_increaseTime", [15]);
        return;
    }
    const currentTime = currentBlock.timestamp;
    const futureTime = currentTime + forwardTime;
    await hre.ethers.provider.send("evm_setNextBlockTimestamp", [futureTime]);
    await hre.ethers.provider.send("evm_mine", []);
};
exports.advanceTimeAndBlock = advanceTimeAndBlock;
const parseUnitsFromToken = async (tokenAddress, amount) => {
    const artifact = await hre.deployments.getArtifact("@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol:IERC20Detailed");
    const token = (await hre.ethers.getContractAt(artifact.abi, tokenAddress));
    const decimals = (await token.decimals()).toString();
    return hre.ethers.utils.parseUnits(amount, decimals);
};
exports.parseUnitsFromToken = parseUnitsFromToken;
const waitDeployment = async (instance) => {
    await (0, exports.waitForTx)(instance.deployTransaction);
    return instance;
};
exports.waitDeployment = waitDeployment;
const getBlockTimestamp = async (blockNumber) => {
    if (!blockNumber) {
        const block = await hre.ethers.provider.getBlock("latest");
        if (!block) {
            throw `getBlockTimestamp: missing block number ${blockNumber}`;
        }
        return block.timestamp;
    }
    let block = await hre.ethers.provider.getBlock(blockNumber);
    if (!block) {
        throw `getBlockTimestamp: missing block number ${blockNumber}`;
    }
    return block.timestamp;
};
exports.getBlockTimestamp = getBlockTimestamp;
const deployContract = async (contract, args, libraries, id) => {
    const { deployer: from } = await hre.getNamedAccounts();
    const artifact = await hre.deployments.deploy(id || `${contract}-${crypto_1.default.randomUUID()}`, // Prevent collisions with principal deployment in tests environment
    {
        contract,
        args,
        from,
        libraries,
    });
    return hre.ethers.getContractAt(artifact.abi, artifact.address);
};
exports.deployContract = deployContract;
const getContract = async (id, address) => {
    const artifact = await hre.deployments.getArtifact(id);
    return hre.ethers.getContractAt(artifact.abi, address || (await (await hre.deployments.get(id)).address));
};
exports.getContract = getContract;
const getWalletBalances = async () => {
    const accounts = await hre.getNamedAccounts();
    const accountTable = await bluebird_1.default.reduce(Object.keys(accounts), async (acc, accKey) => {
        acc.push({
            name: accKey,
            account: accounts[accKey],
            balance: (0, utils_1.formatEther)(await hre.ethers.provider.getBalance(accounts[accKey])),
        });
        return acc;
    }, []);
    return accountTable;
};
exports.getWalletBalances = getWalletBalances;
const getProxyAdminBySlot = async (proxyAddress) => {
    const proxyAdminSlot = await hre.ethers.provider.getStorageAt(proxyAddress, "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103" // keccak-256 eip1967.proxy.admin sub 1
    );
    return hre.ethers.utils.getAddress(hre.ethers.utils.defaultAbiCoder
        .decode(["address"], proxyAdminSlot)
        .toString());
};
exports.getProxyAdminBySlot = getProxyAdminBySlot;
const getProxyImplementationBySlot = async (proxyAddress) => {
    const proxyImplementationSlot = await hre.ethers.provider.getStorageAt(proxyAddress, "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc");
    return hre.ethers.utils.getAddress(hre.ethers.utils.defaultAbiCoder
        .decode(["address"], proxyImplementationSlot)
        .toString());
};
exports.getProxyImplementationBySlot = getProxyImplementationBySlot;
const getAddressFromJson = async (network, id) => {
    const artifactPath = path_1.default.join(__dirname, "../../deployments", network, `${id}.json`);
    const artifact = await promises_1.default.readFile(artifactPath, "utf8");
    const artifactJson = JSON.parse(artifact);
    if (artifactJson.address) {
        return artifactJson.address;
    }
    throw `Missing artifact at ${artifactPath}`;
};
exports.getAddressFromJson = getAddressFromJson;
