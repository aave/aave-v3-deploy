"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployEmissionManager = exports.deployL2Encoder = exports.deployL2Mock2Pool = exports.deployL2DeployerImplementation = exports.deployCalldataLogicLibrary = exports.deployInitializableAdminUpgradeabilityProxy = exports.setupStkAave = exports.deployStakedAaveV1 = exports.deployStakedAaveV2 = exports.deployStakedAaveV3 = exports.deployWrappedTokenGateway = exports.deployMockReentrantInitializableImple = exports.deployMockInitializableFromConstructorImple = exports.deployMockInitializableImpleV2 = exports.deployMockInitializableImple = exports.deployMockPool = exports.deployMockReserveConfiguration = exports.deployMockIncentivesController = exports.deployMockAToken = exports.deployMockVariableDebtToken = exports.deployWETHMocked = exports.deployMockStableDebtToken = exports.deployInitializableImmutableAdminUpgradeabilityProxy = exports.deployReservesSetupHelper = exports.deployDelegationAwareATokenImpl = exports.deployDelegationAwareAToken = exports.deployGenericATokenImpl = exports.deployGenericAToken = exports.deployGenericVariableDebtToken = exports.deployGenericStableDebtToken = exports.deployDefaultReserveInterestRateStrategy = exports.deployMintableDelegationERC20 = exports.deployMintableERC20 = exports.deployAaveProtocolDataProvider = exports.deployMockFlashLoanReceiver = exports.deployAaveOracle = exports.deployMockAggregator = exports.deployPriceOracle = exports.deployMockPoolInherited = exports.deployPool = exports.deployPoolConfigurator = exports.deployConfiguratorLogicLibrary = exports.deployACLManager = exports.deployPoolAddressesProviderRegistry = exports.deployPoolAddressesProvider = exports.deployUiPoolDataProvider = exports.deployUiIncentiveDataProvider = void 0;
const constants_1 = require("./constants");
const contract_getters_1 = require("./contract-getters");
const tx_1 = require("./utilities/tx");
const deploy_ids_1 = require("./deploy-ids");
const tx_2 = require("./utilities/tx");
const deploy_ids_2 = require("./deploy-ids");
const deployUiIncentiveDataProvider = async () => await (0, tx_1.deployContract)("UiIncentiveDataProviderV3");
exports.deployUiIncentiveDataProvider = deployUiIncentiveDataProvider;
const deployUiPoolDataProvider = async (chainlinkAggregatorProxy, chainlinkEthUsdAggregatorProxy) => await (0, tx_1.deployContract)("UiPoolDataProviderV3", [
    chainlinkAggregatorProxy,
    chainlinkEthUsdAggregatorProxy,
]);
exports.deployUiPoolDataProvider = deployUiPoolDataProvider;
const deployPoolAddressesProvider = async (marketId) => await (0, tx_1.deployContract)("PoolAddressesProvider", [
    marketId,
]);
exports.deployPoolAddressesProvider = deployPoolAddressesProvider;
const deployPoolAddressesProviderRegistry = async () => await (0, tx_1.deployContract)("PoolAddressesProviderRegistry");
exports.deployPoolAddressesProviderRegistry = deployPoolAddressesProviderRegistry;
const deployACLManager = async (provider) => await (0, tx_1.deployContract)("ACLManager", [provider]);
exports.deployACLManager = deployACLManager;
const deployConfiguratorLogicLibrary = async () => await (0, tx_1.deployContract)("ConfiguratorLogic");
exports.deployConfiguratorLogicLibrary = deployConfiguratorLogicLibrary;
const deployPoolConfigurator = async () => {
    const configuratorLogicArtifact = await hre.deployments.get("ConfiguratorLogic");
    return await (0, tx_1.deployContract)("PoolConfigurator", [], {
        ConfiguratorLogic: configuratorLogicArtifact.address,
    });
};
exports.deployPoolConfigurator = deployPoolConfigurator;
const deployPool = async (provider) => {
    const libraries = await (0, contract_getters_1.getPoolLibraries)();
    provider =
        provider ||
            (await (await hre.deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID)).address);
    return await (0, tx_1.deployContract)("Pool", [provider], libraries);
};
exports.deployPool = deployPool;
const deployMockPoolInherited = async (provider) => {
    const libraries = await (0, contract_getters_1.getPoolLibraries)();
    provider =
        provider ||
            (await (await hre.deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID)).address);
    return await (0, tx_1.deployContract)("MockPoolInherited", [provider], libraries);
};
exports.deployMockPoolInherited = deployMockPoolInherited;
const deployPriceOracle = async () => await (0, tx_1.deployContract)("PriceOracle");
exports.deployPriceOracle = deployPriceOracle;
const deployMockAggregator = async (price) => await (0, tx_1.deployContract)("MockAggregator", [price]);
exports.deployMockAggregator = deployMockAggregator;
const deployAaveOracle = async (args) => (0, tx_1.deployContract)("AaveOracle", args);
exports.deployAaveOracle = deployAaveOracle;
const deployMockFlashLoanReceiver = async (addressesProvider) => (0, tx_1.deployContract)("MockFlashLoanReceiver", [
    addressesProvider,
]);
exports.deployMockFlashLoanReceiver = deployMockFlashLoanReceiver;
const deployAaveProtocolDataProvider = async (addressesProvider) => (0, tx_1.deployContract)("AaveProtocolDataProvider", [
    addressesProvider,
]);
exports.deployAaveProtocolDataProvider = deployAaveProtocolDataProvider;
const deployMintableERC20 = async (args) => (0, tx_1.deployContract)("MintableERC20", args);
exports.deployMintableERC20 = deployMintableERC20;
const deployMintableDelegationERC20 = async (args) => (0, tx_1.deployContract)("MintableDelegationERC20", args);
exports.deployMintableDelegationERC20 = deployMintableDelegationERC20;
const deployDefaultReserveInterestRateStrategy = async (args) => (0, tx_1.deployContract)("DefaultReserveInterestRateStrategy", args);
exports.deployDefaultReserveInterestRateStrategy = deployDefaultReserveInterestRateStrategy;
const deployGenericStableDebtToken = async (poolAddress) => (0, tx_1.deployContract)("StableDebtToken", [poolAddress]);
exports.deployGenericStableDebtToken = deployGenericStableDebtToken;
const deployGenericVariableDebtToken = async (poolAddress) => (0, tx_1.deployContract)("VariableDebtToken", [poolAddress]);
exports.deployGenericVariableDebtToken = deployGenericVariableDebtToken;
const deployGenericAToken = async ([poolAddress, underlyingAssetAddress, treasuryAddress, incentivesController, name, symbol,]) => {
    const instance = await (0, tx_1.deployContract)("AToken", [poolAddress]);
    await instance.initialize(poolAddress, treasuryAddress, underlyingAssetAddress, incentivesController, "18", name, symbol, "0x10");
    return instance;
};
exports.deployGenericAToken = deployGenericAToken;
const deployGenericATokenImpl = async (poolAddress) => (0, tx_1.deployContract)("AToken", [poolAddress]);
exports.deployGenericATokenImpl = deployGenericATokenImpl;
const deployDelegationAwareAToken = async ([poolAddress, underlyingAssetAddress, treasuryAddress, incentivesController, name, symbol,]) => {
    const instance = await (0, tx_1.deployContract)("DelegationAwareAToken", [poolAddress]);
    await instance.initialize(poolAddress, treasuryAddress, underlyingAssetAddress, incentivesController, "18", name, symbol, "0x10");
    return instance;
};
exports.deployDelegationAwareAToken = deployDelegationAwareAToken;
const deployDelegationAwareATokenImpl = async (poolAddress) => (0, tx_1.deployContract)("DelegationAwareAToken", [poolAddress]);
exports.deployDelegationAwareATokenImpl = deployDelegationAwareATokenImpl;
const deployReservesSetupHelper = async () => (0, tx_1.deployContract)("ReservesSetupHelper");
exports.deployReservesSetupHelper = deployReservesSetupHelper;
const deployInitializableImmutableAdminUpgradeabilityProxy = async (args) => (0, tx_1.deployContract)("InitializableImmutableAdminUpgradeabilityProxy", args);
exports.deployInitializableImmutableAdminUpgradeabilityProxy = deployInitializableImmutableAdminUpgradeabilityProxy;
const deployMockStableDebtToken = async (args) => {
    const instance = await (0, tx_1.deployContract)("MockStableDebtToken", [args[0]]);
    await instance.initialize(args[0], args[1], args[2], "18", args[3], args[4], args[5]);
    return instance;
};
exports.deployMockStableDebtToken = deployMockStableDebtToken;
const deployWETHMocked = async () => (0, tx_1.deployContract)("WETH9Mocked");
exports.deployWETHMocked = deployWETHMocked;
const deployMockVariableDebtToken = async (args) => {
    const instance = await (0, tx_1.deployContract)("MockVariableDebtToken", [args[0]]);
    await instance.initialize(args[0], args[1], args[2], "18", args[3], args[4], args[5]);
    return instance;
};
exports.deployMockVariableDebtToken = deployMockVariableDebtToken;
const deployMockAToken = async (args) => {
    const instance = await (0, tx_1.deployContract)("MockAToken", [args[0]]);
    await instance.initialize(args[0], args[2], args[1], args[3], "18", args[4], args[5], args[6]);
    return instance;
};
exports.deployMockAToken = deployMockAToken;
const deployMockIncentivesController = async () => (0, tx_1.deployContract)("MockIncentivesController");
exports.deployMockIncentivesController = deployMockIncentivesController;
const deployMockReserveConfiguration = async () => (0, tx_1.deployContract)("MockReserveConfiguration");
exports.deployMockReserveConfiguration = deployMockReserveConfiguration;
const deployMockPool = async () => (0, tx_1.deployContract)("MockPool");
exports.deployMockPool = deployMockPool;
const deployMockInitializableImple = async () => (0, tx_1.deployContract)("MockInitializableImple");
exports.deployMockInitializableImple = deployMockInitializableImple;
const deployMockInitializableImpleV2 = async () => (0, tx_1.deployContract)("MockInitializableImpleV2");
exports.deployMockInitializableImpleV2 = deployMockInitializableImpleV2;
const deployMockInitializableFromConstructorImple = async (args) => (0, tx_1.deployContract)("MockInitializableFromConstructorImple", args);
exports.deployMockInitializableFromConstructorImple = deployMockInitializableFromConstructorImple;
const deployMockReentrantInitializableImple = async () => (0, tx_1.deployContract)("MockReentrantInitializableImple");
exports.deployMockReentrantInitializableImple = deployMockReentrantInitializableImple;
const deployWrappedTokenGateway = async (wrappedToken) => (0, tx_1.deployContract)("WrappedTokenGatewayV3", [
    wrappedToken,
]);
exports.deployWrappedTokenGateway = deployWrappedTokenGateway;
const deployStakedAaveV3 = async ([stakedToken, rewardsToken, cooldownSeconds, unstakeWindow, rewardsVault, emissionManager, distributionDuration,]) => {
    const args = [
        stakedToken,
        rewardsToken,
        cooldownSeconds,
        unstakeWindow,
        rewardsVault,
        emissionManager,
        distributionDuration,
        "Staked AAVE",
        "stkAAVE",
        "18",
        constants_1.ZERO_ADDRESS, // gov
    ];
    return (0, tx_1.deployContract)("StakedTokenV2Rev3", args, undefined, deploy_ids_2.STAKE_AAVE_IMPL_V3);
};
exports.deployStakedAaveV3 = deployStakedAaveV3;
const deployStakedAaveV2 = async ([stakedToken, rewardsToken, cooldownSeconds, unstakeWindow, rewardsVault, emissionManager, distributionDuration,]) => {
    const { deployer } = await hre.getNamedAccounts();
    const args = [
        stakedToken,
        rewardsToken,
        cooldownSeconds,
        unstakeWindow,
        rewardsVault,
        emissionManager,
        distributionDuration,
        constants_1.ZERO_ADDRESS, // gov address
    ];
    return (0, tx_1.deployContract)("StakedAaveV2", args, undefined, deploy_ids_2.STAKE_AAVE_IMPL_V2);
};
exports.deployStakedAaveV2 = deployStakedAaveV2;
const deployStakedAaveV1 = async ([stakedToken, rewardsToken, cooldownSeconds, unstakeWindow, rewardsVault, emissionManager, distributionDuration,]) => {
    const { deployer } = await hre.getNamedAccounts();
    const args = [
        stakedToken,
        rewardsToken,
        cooldownSeconds,
        unstakeWindow,
        rewardsVault,
        emissionManager,
        distributionDuration,
    ];
    return (0, tx_1.deployContract)("StakedAave", args, undefined, deploy_ids_2.STAKE_AAVE_IMPL_V1);
};
exports.deployStakedAaveV1 = deployStakedAaveV1;
const setupStkAave = async (proxy, args) => {
    const { incentivesProxyAdmin } = await hre.getNamedAccounts();
    const proxyAdmin = await hre.ethers.getSigner(incentivesProxyAdmin);
    const implRev1 = await (0, exports.deployStakedAaveV1)(args);
    const implRev2 = await (0, exports.deployStakedAaveV2)(args);
    const implRev3 = await (0, exports.deployStakedAaveV3)(args);
    const proxyAdminSlot = await hre.ethers.provider.getStorageAt(proxy.address, "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103" // keccak-256 eip1967.proxy.admin sub 1
    );
    const initialPayloadStkAaveRev1 = implRev1
        .connect(proxyAdmin)
        .interface.encodeFunctionData("initialize", [
        constants_1.ZERO_ADDRESS,
        "Staked AAVE",
        "stkAAVE",
        18,
    ]);
    const upgradePayloadStkAaveRev2andRev3 = implRev2
        .connect(proxyAdmin)
        .interface.encodeFunctionData("initialize");
    const stkProxy = proxy.connect(proxyAdmin);
    const proxyWithImpl = implRev1.attach(stkProxy.address);
    if (proxyAdminSlot === constants_1.EMPTY_STORAGE_SLOT) {
        // Initialize
        await (0, tx_2.waitForTx)(await stkProxy["initialize(address,address,bytes)"](implRev1.address, proxyAdmin.address, initialPayloadStkAaveRev1));
        console.log("- Initializing admin proxy for stkAAVE");
    }
    const revisionV1 = Number((await proxyWithImpl.REVISION()).toString());
    if (revisionV1 < 2) {
        // Upgrade to Revision 2
        await (0, tx_2.waitForTx)(await stkProxy.upgradeToAndCall(implRev2.address, upgradePayloadStkAaveRev2andRev3));
        console.log("- Upgraded stkAAVE to Revision 2");
    }
    const revisionV2 = Number((await proxyWithImpl.REVISION()).toString());
    if (revisionV2 < 3) {
        // Upgrade to Revision 3
        await (0, tx_2.waitForTx)(await stkProxy.upgradeToAndCall(implRev3.address, upgradePayloadStkAaveRev2andRev3));
        console.log("- Upgraded stkAAVE to Revision 3");
    }
    const revisionV3 = Number((await proxyWithImpl.REVISION()).toString());
    console.log("stkAAVE:");
    console.log("- revision:", revisionV3);
    console.log("- name:", await proxyWithImpl.name());
    console.log("- symbol:", await proxyWithImpl.symbol());
    console.log("- decimals:", await proxyWithImpl.decimals());
};
exports.setupStkAave = setupStkAave;
const deployInitializableAdminUpgradeabilityProxy = async (slug) => (0, tx_1.deployContract)("InitializableAdminUpgradeabilityProxy", [], undefined, slug);
exports.deployInitializableAdminUpgradeabilityProxy = deployInitializableAdminUpgradeabilityProxy;
const deployCalldataLogicLibrary = async () => (0, tx_1.deployContract)("CalldataLogic");
exports.deployCalldataLogicLibrary = deployCalldataLogicLibrary;
const deployL2DeployerImplementation = async (addressesProviderAddress) => {
    const commonLibraries = await (0, contract_getters_1.getPoolLibraries)();
    const CalldataLogic = await (await hre.deployments.get("EModeLogic")).address;
    return (0, tx_1.deployContract)("L2Pool", [addressesProviderAddress], {
        ...commonLibraries,
        CalldataLogic,
    });
};
exports.deployL2DeployerImplementation = deployL2DeployerImplementation;
const deployL2Mock2Pool = async (addressesProviderAddress) => (0, tx_1.deployContract)("MockL2Pool", [addressesProviderAddress]);
exports.deployL2Mock2Pool = deployL2Mock2Pool;
const deployL2Encoder = async (poolProxy) => (0, tx_1.deployContract)("L2Encoder", [poolProxy]);
exports.deployL2Encoder = deployL2Encoder;
const deployEmissionManager = async (rewardsController, owner) => (0, tx_1.deployContract)("EmissionManager", [
    rewardsController,
    owner,
]);
exports.deployEmissionManager = deployEmissionManager;
