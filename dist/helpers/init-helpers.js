"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMarketToRegistry = exports.configureReservesByHelper = exports.getPairsTokenAggregator = exports.initReservesByHelper = void 0;
const types_1 = require("./types");
const deploy_ids_1 = require("./deploy-ids");
const utils_1 = require("./utilities/utils");
const tx_1 = require("./utilities/tx");
const env_1 = require("./env");
const market_config_helpers_1 = require("./market-config-helpers");
const constants_1 = require("./constants");
const initReservesByHelper = async (reservesParams, tokenAddresses, aTokenNamePrefix, stableDebtTokenNamePrefix, variableDebtTokenNamePrefix, symbolPrefix, admin, treasuryAddress, incentivesController) => {
    const poolConfig = (await (0, market_config_helpers_1.loadPoolConfig)(env_1.MARKET_NAME));
    const addressProviderArtifact = await hre.deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID);
    const addressProvider = (await hre.ethers.getContractAt(addressProviderArtifact.abi, addressProviderArtifact.address)).connect(await hre.ethers.getSigner(admin));
    const poolArtifact = await hre.deployments.get((0, market_config_helpers_1.isL2PoolSupported)(poolConfig) ? deploy_ids_1.L2_POOL_IMPL_ID : deploy_ids_1.POOL_IMPL_ID);
    const pool = (await hre.ethers.getContractAt(poolArtifact.abi, await addressProvider.getPool()));
    // CHUNK CONFIGURATION
    const initChunks = 3;
    // Initialize variables for future reserves initialization
    let reserveTokens = [];
    let reserveInitDecimals = [];
    let reserveSymbols = [];
    let initInputParams = [];
    let strategyAddresses = {};
    let strategyAddressPerAsset = {};
    let aTokenType = {};
    let delegationAwareATokenImplementationAddress = "";
    let aTokenImplementationAddress = "";
    let stableDebtTokenImplementationAddress = "";
    let variableDebtTokenImplementationAddress = "";
    stableDebtTokenImplementationAddress = (await hre.deployments.get(deploy_ids_1.STABLE_DEBT_TOKEN_IMPL_ID)).address;
    variableDebtTokenImplementationAddress = await (await hre.deployments.get(deploy_ids_1.VARIABLE_DEBT_TOKEN_IMPL_ID)).address;
    aTokenImplementationAddress = (await hre.deployments.get(deploy_ids_1.ATOKEN_IMPL_ID))
        .address;
    const delegatedAwareReserves = Object.entries(reservesParams).filter(([_, { aTokenImpl }]) => aTokenImpl === types_1.eContractid.DelegationAwareAToken);
    if (delegatedAwareReserves.length > 0) {
        delegationAwareATokenImplementationAddress = (await hre.deployments.get(deploy_ids_1.DELEGATION_AWARE_ATOKEN_IMPL_ID)).address;
    }
    const reserves = Object.entries(reservesParams).filter(([_, { aTokenImpl }]) => aTokenImpl === types_1.eContractid.DelegationAwareAToken ||
        aTokenImpl === types_1.eContractid.AToken);
    for (let [symbol, params] of reserves) {
        if (!tokenAddresses[symbol]) {
            console.log(`- Skipping init of ${symbol} due token address is not set at markets config`);
            continue;
        }
        const poolReserve = await pool.getReserveData(tokenAddresses[symbol]);
        if (poolReserve.aTokenAddress !== constants_1.ZERO_ADDRESS) {
            console.log(`- Skipping init of ${symbol} due is already initialized`);
            continue;
        }
        const { strategy, aTokenImpl, reserveDecimals } = params;
        if (!strategyAddresses[strategy.name]) {
            // Strategy does not exist, load it
            strategyAddresses[strategy.name] = (await hre.deployments.get(`ReserveStrategy-${strategy.name}`)).address;
        }
        strategyAddressPerAsset[symbol] = strategyAddresses[strategy.name];
        console.log("Strategy address for asset %s: %s", symbol, strategyAddressPerAsset[symbol]);
        if (aTokenImpl === types_1.eContractid.AToken) {
            aTokenType[symbol] = "generic";
        }
        else if (aTokenImpl === types_1.eContractid.DelegationAwareAToken) {
            aTokenType[symbol] = "delegation aware";
        }
        reserveInitDecimals.push(reserveDecimals);
        reserveTokens.push(tokenAddresses[symbol]);
        reserveSymbols.push(symbol);
    }
    for (let i = 0; i < reserveSymbols.length; i++) {
        let aTokenToUse;
        if (aTokenType[reserveSymbols[i]] === "generic") {
            aTokenToUse = aTokenImplementationAddress;
        }
        else {
            aTokenToUse = delegationAwareATokenImplementationAddress;
        }
        initInputParams.push({
            aTokenImpl: aTokenToUse,
            stableDebtTokenImpl: stableDebtTokenImplementationAddress,
            variableDebtTokenImpl: variableDebtTokenImplementationAddress,
            underlyingAssetDecimals: reserveInitDecimals[i],
            interestRateStrategyAddress: strategyAddressPerAsset[reserveSymbols[i]],
            underlyingAsset: reserveTokens[i],
            treasury: treasuryAddress,
            incentivesController,
            underlyingAssetName: reserveSymbols[i],
            aTokenName: `Aave ${aTokenNamePrefix} ${reserveSymbols[i]}`,
            aTokenSymbol: `a${symbolPrefix}${reserveSymbols[i]}`,
            variableDebtTokenName: `Aave ${variableDebtTokenNamePrefix} Variable Debt ${reserveSymbols[i]}`,
            variableDebtTokenSymbol: `variableDebt${symbolPrefix}${reserveSymbols[i]}`,
            stableDebtTokenName: `Aave ${stableDebtTokenNamePrefix} Stable Debt ${reserveSymbols[i]}`,
            stableDebtTokenSymbol: `stableDebt${symbolPrefix}${reserveSymbols[i]}`,
            params: "0x10",
        });
    }
    // Deploy init reserves per chunks
    const chunkedSymbols = (0, utils_1.chunk)(reserveSymbols, initChunks);
    const chunkedInitInputParams = (0, utils_1.chunk)(initInputParams, initChunks);
    const proxyArtifact = await hre.deployments.get(deploy_ids_1.POOL_CONFIGURATOR_PROXY_ID);
    const configuratorArtifact = await hre.deployments.get(deploy_ids_1.POOL_CONFIGURATOR_IMPL_ID);
    const configurator = (await hre.ethers.getContractAt(configuratorArtifact.abi, proxyArtifact.address)).connect(await hre.ethers.getSigner(admin));
    console.log(`- Reserves initialization in ${chunkedInitInputParams.length} txs`);
    for (let chunkIndex = 0; chunkIndex < chunkedInitInputParams.length; chunkIndex++) {
        const tx = await (0, tx_1.waitForTx)(await configurator.initReserves(chunkedInitInputParams[chunkIndex]));
        console.log(`  - Reserve ready for: ${chunkedSymbols[chunkIndex].join(", ")}`, `\n    - Tx hash: ${tx.transactionHash}`);
    }
};
exports.initReservesByHelper = initReservesByHelper;
const getPairsTokenAggregator = (allAssetsAddresses, aggregatorsAddresses) => {
    const { ETH, USD, ...assetsAddressesWithoutEth } = allAssetsAddresses;
    const pairs = Object.entries(assetsAddressesWithoutEth).map(([tokenSymbol, tokenAddress]) => {
        const aggregatorAddressIndex = Object.keys(aggregatorsAddresses).findIndex((value) => value === tokenSymbol);
        const [, aggregatorAddress] = Object.entries(aggregatorsAddresses)[aggregatorAddressIndex];
        if (!aggregatorAddress)
            throw `Missing aggregator for ${tokenSymbol}`;
        if (!tokenAddress)
            throw `Missing token address for ${tokenSymbol}`;
        return [tokenAddress, aggregatorAddress];
    });
    const mappedPairs = pairs.map(([asset]) => asset);
    const mappedAggregators = pairs.map(([, source]) => source);
    return [mappedPairs, mappedAggregators];
};
exports.getPairsTokenAggregator = getPairsTokenAggregator;
const configureReservesByHelper = async (reservesParams, tokenAddresses) => {
    const { deployer } = await hre.getNamedAccounts();
    const addressProviderArtifact = await hre.deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID);
    const addressProvider = (await hre.ethers.getContractAt(addressProviderArtifact.abi, addressProviderArtifact.address));
    const aclManagerArtifact = await hre.deployments.get(deploy_ids_1.ACL_MANAGER_ID);
    const aclManager = (await hre.ethers.getContractAt(aclManagerArtifact.abi, await addressProvider.getACLManager()));
    const reservesSetupArtifact = await hre.deployments.get(deploy_ids_1.RESERVES_SETUP_HELPER_ID);
    const reservesSetupHelper = (await hre.ethers.getContractAt(reservesSetupArtifact.abi, reservesSetupArtifact.address)).connect(await hre.ethers.getSigner(deployer));
    const protocolDataArtifact = await hre.deployments.get(deploy_ids_1.POOL_DATA_PROVIDER);
    const protocolDataProvider = (await hre.ethers.getContractAt(protocolDataArtifact.abi, (await hre.deployments.get(deploy_ids_1.POOL_DATA_PROVIDER)).address));
    const tokens = [];
    const symbols = [];
    const inputParams = [];
    for (const [assetSymbol, { baseLTVAsCollateral, liquidationBonus, liquidationThreshold, reserveFactor, borrowCap, supplyCap, stableBorrowRateEnabled, borrowingEnabled, flashLoanEnabled, },] of Object.entries(reservesParams)) {
        if (!tokenAddresses[assetSymbol]) {
            console.log(`- Skipping init of ${assetSymbol} due token address is not set at markets config`);
            continue;
        }
        if (baseLTVAsCollateral === "-1")
            continue;
        const assetAddressIndex = Object.keys(tokenAddresses).findIndex((value) => value === assetSymbol);
        const [, tokenAddress] = Object.entries(tokenAddresses)[assetAddressIndex];
        const { usageAsCollateralEnabled: alreadyEnabled } = await protocolDataProvider.getReserveConfigurationData(tokenAddress);
        if (alreadyEnabled) {
            console.log(`- Reserve ${assetSymbol} is already enabled as collateral, skipping`);
            continue;
        }
        // Push data
        inputParams.push({
            asset: tokenAddress,
            baseLTV: baseLTVAsCollateral,
            liquidationThreshold,
            liquidationBonus,
            reserveFactor,
            borrowCap,
            supplyCap,
            stableBorrowingEnabled: stableBorrowRateEnabled,
            borrowingEnabled: borrowingEnabled,
            flashLoanEnabled: flashLoanEnabled,
        });
        tokens.push(tokenAddress);
        symbols.push(assetSymbol);
    }
    if (tokens.length) {
        // Set aTokenAndRatesDeployer as temporal admin
        const aclAdmin = await hre.ethers.getSigner(await addressProvider.getACLAdmin());
        await (0, tx_1.waitForTx)(await aclManager
            .connect(aclAdmin)
            .addRiskAdmin(reservesSetupHelper.address));
        // Deploy init per chunks
        const enableChunks = 20;
        const chunkedSymbols = (0, utils_1.chunk)(symbols, enableChunks);
        const chunkedInputParams = (0, utils_1.chunk)(inputParams, enableChunks);
        const poolConfiguratorAddress = await addressProvider.getPoolConfigurator();
        console.log(`- Configure reserves in ${chunkedInputParams.length} txs`);
        for (let chunkIndex = 0; chunkIndex < chunkedInputParams.length; chunkIndex++) {
            const tx = await (0, tx_1.waitForTx)(await reservesSetupHelper.configureReserves(poolConfiguratorAddress, chunkedInputParams[chunkIndex]));
            console.log(`  - Init for: ${chunkedSymbols[chunkIndex].join(", ")}`, `\n    - Tx hash: ${tx.transactionHash}`);
        }
        // Remove ReservesSetupHelper from risk admins
        await (0, tx_1.waitForTx)(await aclManager
            .connect(aclAdmin)
            .removeRiskAdmin(reservesSetupHelper.address));
    }
};
exports.configureReservesByHelper = configureReservesByHelper;
const addMarketToRegistry = async (providerId, addressesProvider) => {
    const providerRegistry = await hre.deployments.get("PoolAddressesProviderRegistry");
    const providerRegistryInstance = (await hre.ethers.getContractAt(providerRegistry.abi, providerRegistry.address));
    const providerRegistryOwner = await providerRegistryInstance.owner();
    if (!(0, utils_1.isValidAddress)(addressesProvider)) {
        throw Error('[add-market-to-registry] Input parameter "addressesProvider" is missing or is not an address.');
    }
    const signer = await hre.ethers.getSigner(providerRegistryOwner);
    // 1. Set the provider at the Registry
    await (0, tx_1.waitForTx)(await providerRegistryInstance
        .connect(signer)
        .registerAddressesProvider(addressesProvider, providerId));
    console.log(`Added LendingPoolAddressesProvider with address "${addressesProvider}" to registry located at ${providerRegistry.address}`);
};
exports.addMarketToRegistry = addMarketToRegistry;
