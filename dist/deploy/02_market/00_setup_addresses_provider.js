"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../helpers/constants");
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const init_helpers_1 = require("../../helpers/init-helpers");
const utils_1 = require("ethers/lib/utils");
const tx_1 = require("../../helpers/utilities/tx");
const utils_2 = require("../../helpers/utilities/utils");
const env_1 = require("../../helpers/env");
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const poolConfig = await (0, market_config_helpers_1.loadPoolConfig)(env_1.MARKET_NAME);
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    // 0. Check beforehand that all reserves have non-zero addresses
    const reserves = await (0, market_config_helpers_1.getReserveAddresses)(poolConfig, network);
    console.log(reserves);
    const reservesConfig = poolConfig.ReservesConfig;
    const reserveConfigSymbols = Object.keys(reservesConfig);
    const reserveSymbols = Object.keys(reserves);
    if (!(0, utils_2.containsSameMembers)(reserveConfigSymbols, reserveSymbols)) {
        console.log(reserveConfigSymbols);
        console.log(reserveSymbols);
        throw "[Deployment][Error] Mismatch between Config.ReservesConfig and Config.ReserveAssets token symbols";
    }
    if (reserveSymbols.length === 0) {
        console.warn("[Warning] Market Config does not contain ReservesConfig. Skipping check of Reserves and ReservesConfig.");
    }
    for (let y = 0; y < reserveSymbols.length; y++) {
        if (!reserves[reserveSymbols[y]] ||
            (0, utils_1.getAddress)(reserves[reserveSymbols[y]]) === constants_1.ZERO_ADDRESS) {
            throw `[Deployment][Error] Missing token ${reserveSymbols[y]} ReserveAssets configuration`;
        }
    }
    // 1. Deploy PoolAddressesProvider
    // NOTE: The script passes 0 as market id to create the same address of PoolAddressesProvider
    // in multiple networks via CREATE2. Later in this script it will update the corresponding Market ID.
    const addressesProviderArtifact = await deploy(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID, {
        from: deployer,
        contract: "PoolAddressesProvider",
        args: ["0", deployer],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const signer = await hre.ethers.getSigner(deployer);
    const addressesProviderInstance = (await hre.ethers.getContractAt(addressesProviderArtifact.abi, addressesProviderArtifact.address)).connect(signer);
    // 2. Set the MarketId
    await (0, tx_1.waitForTx)(await addressesProviderInstance.setMarketId(poolConfig.MarketId));
    // 3. Add AddressesProvider to Registry
    await (0, init_helpers_1.addMarketToRegistry)(poolConfig.ProviderId, addressesProviderArtifact.address);
    // 4. Deploy AaveProtocolDataProvider getters contract
    const protocolDataProvider = await deploy(deploy_ids_1.POOL_DATA_PROVIDER, {
        from: deployer,
        contract: "AaveProtocolDataProvider",
        args: [addressesProviderArtifact.address],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const currentProtocolDataProvider = await addressesProviderInstance.getPoolDataProvider();
    // Set the ProtocolDataProvider if is not already set at addresses provider
    if (!(0, utils_2.isEqualAddress)(protocolDataProvider.address, currentProtocolDataProvider)) {
        await (0, tx_1.waitForTx)(await addressesProviderInstance.setPoolDataProvider(protocolDataProvider.address));
    }
    return true;
};
// This script can only be run successfully once per market, core version, and network
func.id = `PoolAddressesProvider:${env_1.MARKET_NAME}:aave-v3-core@${constants_1.V3_CORE_VERSION}`;
func.tags = ["market", "provider"];
func.dependencies = ["before-deploy", "core", "periphery-pre"];
func.skip = async () => (0, market_config_helpers_1.checkRequiredEnvironment)();
exports.default = func;
