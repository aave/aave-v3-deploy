"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnableContract = exports.getEmissionManager = exports.getL2Encoder = exports.getStakeAave = exports.getStakedRewardsStrategy = exports.getPullRewardsStrategy = exports.getIncentivesV2 = exports.getWalletBalanceProvider = exports.getUiIncentiveDataProvider = exports.getUiPoolDataProvider = exports.getWrappedTokenGateway = exports.getFaucet = exports.getTestnetReserveAddressFromSymbol = exports.getPoolLibraries = exports.getMockInitializableImpleV2 = exports.getMockInitializableImple = exports.getMockL2Pool = exports.getMockPool = exports.getMockStableDebtToken = exports.getMockVariableDebtToken = exports.getWETHMocked = exports.getReservesSetupHelper = exports.getPoolAddressesProviderRegistry = exports.getMockFlashLoanReceiver = exports.getFallbackOracle = exports.getAaveOracle = exports.getAaveProtocolDataProvider = exports.getIErc20Detailed = exports.getMintableERC20 = exports.getIRStrategy = exports.getPriceOracle = exports.getPool = exports.getFlashLoanLogic = exports.getEModeLogic = exports.getLiquidationLogic = exports.getBorrowLogic = exports.getBridgeLogic = exports.getSupplyLogic = exports.getPoolConfiguratorProxy = exports.getACLManager = exports.getPoolAddressesProvider = exports.getWETH = exports.getERC20 = exports.getStableDebtToken = exports.getVariableDebtToken = exports.getAToken = void 0;
const signer_1 = require("./utilities/signer");
const deploy_ids_1 = require("./deploy-ids");
const tx_1 = require("./utilities/tx");
const _1 = require(".");
const constants_1 = require("../helpers/constants");
const getAToken = async (address) => (0, tx_1.getContract)("AToken", address);
exports.getAToken = getAToken;
const getVariableDebtToken = async (address) => (0, tx_1.getContract)("VariableDebtToken", address);
exports.getVariableDebtToken = getVariableDebtToken;
const getStableDebtToken = async (address) => (0, tx_1.getContract)("StableDebtToken", address);
exports.getStableDebtToken = getStableDebtToken;
const getERC20 = async (address) => (0, tx_1.getContract)("@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol:IERC20Detailed", address);
exports.getERC20 = getERC20;
const getWETH = async (address) => (0, tx_1.getContract)("WETH9", address);
exports.getWETH = getWETH;
const getPoolAddressesProvider = async (address) => (0, tx_1.getContract)("PoolAddressesProvider", address || (await hre.deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID)).address);
exports.getPoolAddressesProvider = getPoolAddressesProvider;
const getACLManager = async (address) => (0, tx_1.getContract)("ACLManager", address || (await hre.deployments.get(deploy_ids_1.ACL_MANAGER_ID)).address);
exports.getACLManager = getACLManager;
const getPoolConfiguratorProxy = async (address) => (0, tx_1.getContract)("PoolConfigurator", address || (await hre.deployments.get(deploy_ids_1.POOL_CONFIGURATOR_PROXY_ID)).address);
exports.getPoolConfiguratorProxy = getPoolConfiguratorProxy;
const getSupplyLogic = async (address) => (0, tx_1.getContract)("SupplyLogic", address);
exports.getSupplyLogic = getSupplyLogic;
const getBridgeLogic = async (address) => (0, tx_1.getContract)("BridgeLogic", address);
exports.getBridgeLogic = getBridgeLogic;
const getBorrowLogic = async (address) => (0, tx_1.getContract)("BorrowLogic", address);
exports.getBorrowLogic = getBorrowLogic;
const getLiquidationLogic = async (address) => (0, tx_1.getContract)("LiquidationLogic", address);
exports.getLiquidationLogic = getLiquidationLogic;
const getEModeLogic = async (address) => (0, tx_1.getContract)("EModeLogic", address);
exports.getEModeLogic = getEModeLogic;
const getFlashLoanLogic = async (address) => (0, tx_1.getContract)("FlashLoanLogic", address);
exports.getFlashLoanLogic = getFlashLoanLogic;
const getPool = async (address) => (0, tx_1.getContract)("Pool", address || (await hre.deployments.get(deploy_ids_1.POOL_PROXY_ID)).address);
exports.getPool = getPool;
const getPriceOracle = async (address) => (0, tx_1.getContract)("PriceOracle", address);
exports.getPriceOracle = getPriceOracle;
const getIRStrategy = async (address) => (0, tx_1.getContract)("DefaultReserveInterestRateStrategy", address);
exports.getIRStrategy = getIRStrategy;
const getMintableERC20 = async (address) => (0, tx_1.getContract)("MintableERC20", address);
exports.getMintableERC20 = getMintableERC20;
const getIErc20Detailed = async (address) => (0, tx_1.getContract)("@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol:IERC20Detailed", address);
exports.getIErc20Detailed = getIErc20Detailed;
const getAaveProtocolDataProvider = async (address) => (0, tx_1.getContract)("AaveProtocolDataProvider", address || (await hre.deployments.get(deploy_ids_1.POOL_DATA_PROVIDER)).address);
exports.getAaveProtocolDataProvider = getAaveProtocolDataProvider;
const getAaveOracle = async (address) => (0, tx_1.getContract)("AaveOracle", address || (await hre.deployments.get(deploy_ids_1.ORACLE_ID)).address);
exports.getAaveOracle = getAaveOracle;
const getFallbackOracle = async (address) => (0, tx_1.getContract)("PriceOracle", address || (await hre.deployments.get(deploy_ids_1.FALLBACK_ORACLE_ID)).address);
exports.getFallbackOracle = getFallbackOracle;
const getMockFlashLoanReceiver = async (address) => (0, tx_1.getContract)("MockFlashLoanReceiver", address);
exports.getMockFlashLoanReceiver = getMockFlashLoanReceiver;
const getPoolAddressesProviderRegistry = async (address) => (0, tx_1.getContract)("PoolAddressesProviderRegistry", address);
exports.getPoolAddressesProviderRegistry = getPoolAddressesProviderRegistry;
const getReservesSetupHelper = async (address) => (0, tx_1.getContract)("ReservesSetupHelper", address);
exports.getReservesSetupHelper = getReservesSetupHelper;
const getWETHMocked = async (address) => (0, tx_1.getContract)("WETH9Mocked", address);
exports.getWETHMocked = getWETHMocked;
const getMockVariableDebtToken = async (address) => (0, tx_1.getContract)("MockVariableDebtToken", address);
exports.getMockVariableDebtToken = getMockVariableDebtToken;
const getMockStableDebtToken = async (address) => (0, tx_1.getContract)("MockStableDebtToken", address);
exports.getMockStableDebtToken = getMockStableDebtToken;
const getMockPool = async (address) => (0, tx_1.getContract)("MockPool", address);
exports.getMockPool = getMockPool;
const getMockL2Pool = async (address) => (0, tx_1.getContract)("MockL2Pool", address);
exports.getMockL2Pool = getMockL2Pool;
const getMockInitializableImple = async (address) => (0, tx_1.getContract)("MockInitializableImple", address);
exports.getMockInitializableImple = getMockInitializableImple;
const getMockInitializableImpleV2 = async (address) => (0, tx_1.getContract)("MockInitializableImpleV2", address);
exports.getMockInitializableImpleV2 = getMockInitializableImpleV2;
const getPoolLibraries = async () => {
    const supplyLibraryArtifact = await hre.deployments.get("SupplyLogic");
    const borrowLibraryArtifact = await hre.deployments.get("BorrowLogic");
    const liquidationLibraryArtifact = await hre.deployments.get("LiquidationLogic");
    const eModeLibraryArtifact = await hre.deployments.get("EModeLogic");
    const bridgeLibraryArtifact = await hre.deployments.get("BridgeLogic");
    const flashLoanLogicArtifact = await hre.deployments.get("FlashLoanLogic");
    const poolLogicArtifact = await hre.deployments.get("PoolLogic");
    return {
        LiquidationLogic: liquidationLibraryArtifact.address,
        SupplyLogic: supplyLibraryArtifact.address,
        EModeLogic: eModeLibraryArtifact.address,
        FlashLoanLogic: flashLoanLogicArtifact.address,
        BorrowLogic: borrowLibraryArtifact.address,
        BridgeLogic: bridgeLibraryArtifact.address,
        PoolLogic: poolLogicArtifact.address,
    };
};
exports.getPoolLibraries = getPoolLibraries;
const getTestnetReserveAddressFromSymbol = async (symbol) => {
    const testnetReserve = await hre.deployments.get(constants_1.TESTNET_TOKENS[symbol]);
    return testnetReserve.address;
};
exports.getTestnetReserveAddressFromSymbol = getTestnetReserveAddressFromSymbol;
const getFaucet = async (address) => (0, tx_1.getContract)("Faucet", address || (await hre.deployments.get(deploy_ids_1.FAUCET_OWNABLE_ID)).address);
exports.getFaucet = getFaucet;
const getWrappedTokenGateway = async (address) => {
    return (0, tx_1.getContract)("WrappedTokenGatewayV3", address);
};
exports.getWrappedTokenGateway = getWrappedTokenGateway;
const getUiPoolDataProvider = async (address) => (0, tx_1.getContract)("UiPoolDataProviderV3", address);
exports.getUiPoolDataProvider = getUiPoolDataProvider;
const getUiIncentiveDataProvider = async (address) => (0, tx_1.getContract)("UiIncentiveDataProviderV3", address);
exports.getUiIncentiveDataProvider = getUiIncentiveDataProvider;
const getWalletBalanceProvider = async (address) => (0, tx_1.getContract)("WalletBalanceProvider", address);
exports.getWalletBalanceProvider = getWalletBalanceProvider;
const getIncentivesV2 = async (address) => {
    const artifactProxy = await hre.deployments.get(deploy_ids_1.INCENTIVES_PROXY_ID);
    const artifactImpl = await hre.deployments.get(deploy_ids_1.INCENTIVES_V2_IMPL_ID);
    return hre.ethers.getContractAt(artifactImpl.abi, address || artifactProxy.address);
};
exports.getIncentivesV2 = getIncentivesV2;
const getPullRewardsStrategy = async (address) => (0, tx_1.getContract)("PullRewardsTransferStrategy", address ||
    (await hre.deployments.get(deploy_ids_1.INCENTIVES_PULL_REWARDS_STRATEGY_ID)).address);
exports.getPullRewardsStrategy = getPullRewardsStrategy;
const getStakedRewardsStrategy = async (address) => (0, tx_1.getContract)("StakedTokenTransferStrategy", address ||
    (await hre.deployments.get(deploy_ids_1.INCENTIVES_STAKED_TOKEN_STRATEGY_ID)).address);
exports.getStakedRewardsStrategy = getStakedRewardsStrategy;
const getStakeAave = async (address) => {
    const proxyArtifact = await hre.deployments.get(deploy_ids_1.STAKE_AAVE_PROXY);
    const implArtifact = await hre.deployments.get(deploy_ids_1.STAKE_AAVE_IMPL_V3);
    return hre.ethers.getContractAt(implArtifact.abi, address || proxyArtifact.address);
};
exports.getStakeAave = getStakeAave;
const getL2Encoder = async (address) => (0, tx_1.getContract)("L2Encoder", address || (await hre.deployments.get(deploy_ids_1.L2_ENCODER)).address);
exports.getL2Encoder = getL2Encoder;
const getEmissionManager = async (address) => (0, tx_1.getContract)("EmissionManager", address || (await hre.deployments.get(_1.EMISSION_MANAGER_ID)).address);
exports.getEmissionManager = getEmissionManager;
const getOwnableContract = async (address) => {
    const ownableInterface = new hre.ethers.utils.Interface([
        "function owner() public view returns (address)",
        "function transferOwnership(address newOwner) public",
        "function renounceOwnership() public",
    ]);
    return new hre.ethers.Contract(address, ownableInterface, await (0, signer_1.getFirstSigner)());
};
exports.getOwnableContract = getOwnableContract;
