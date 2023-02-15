"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../helpers/constants");
const contract_getters_1 = require("./../../helpers/contract-getters");
const deploy_ids_1 = require("./../../helpers/deploy-ids");
const market_config_helpers_1 = require("./../../helpers/market-config-helpers");
const env_1 = require("../../helpers/env");
const constants_2 = require("../../helpers/constants");
const market_config_helpers_2 = require("../../helpers/market-config-helpers");
const deploy_ids_2 = require("../../helpers/deploy-ids");
const tx_1 = require("../../helpers/utilities/tx");
const env_2 = require("../../helpers/env");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { save, deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const poolConfig = await (0, market_config_helpers_1.loadPoolConfig)(env_2.MARKET_NAME);
    const proxyArtifact = await deployments.getExtendedArtifact("InitializableImmutableAdminUpgradeabilityProxy");
    const poolImplDeployment = (0, market_config_helpers_1.isL2PoolSupported)(poolConfig)
        ? await deployments.get(deploy_ids_1.L2_POOL_IMPL_ID)
        : await deployments.get(deploy_ids_2.POOL_IMPL_ID);
    const poolConfiguratorImplDeployment = await deployments.get(deploy_ids_2.POOL_CONFIGURATOR_IMPL_ID);
    const { address: addressesProvider } = await deployments.get(deploy_ids_2.POOL_ADDRESSES_PROVIDER_ID);
    const addressesProviderInstance = (await (0, tx_1.getContract)("PoolAddressesProvider", addressesProvider)).connect(await hre.ethers.getSigner(deployer));
    const isPoolProxyPending = (await addressesProviderInstance.getPool()) === constants_1.ZERO_ADDRESS;
    // Set Pool implementation to Addresses provider and save the proxy deployment artifact at disk
    if (isPoolProxyPending) {
        const setPoolImplTx = await (0, tx_1.waitForTx)(await addressesProviderInstance.setPoolImpl(poolImplDeployment.address));
        const txPoolProxyAddress = await addressesProviderInstance.getPool();
        deployments.log(`[Deployment] Attached Pool implementation and deployed proxy contract: `);
        deployments.log("- Tx hash:", setPoolImplTx.transactionHash);
    }
    const poolProxyAddress = await addressesProviderInstance.getPool();
    deployments.log("- Deployed Proxy:", poolProxyAddress);
    await save(deploy_ids_2.POOL_PROXY_ID, {
        ...proxyArtifact,
        address: poolProxyAddress,
    });
    const isPoolConfiguratorProxyPending = (await addressesProviderInstance.getPoolConfigurator()) === constants_1.ZERO_ADDRESS;
    // Set Pool Configurator to Addresses Provider proxy deployment artifact at disk
    if (isPoolConfiguratorProxyPending) {
        const setPoolConfiguratorTx = await (0, tx_1.waitForTx)(await addressesProviderInstance.setPoolConfiguratorImpl(poolConfiguratorImplDeployment.address));
        deployments.log(`[Deployment] Attached PoolConfigurator implementation and deployed proxy `);
        deployments.log("- Tx hash:", setPoolConfiguratorTx.transactionHash);
    }
    const poolConfiguratorProxyAddress = await addressesProviderInstance.getPoolConfigurator();
    deployments.log("- Deployed Proxy:", poolConfiguratorProxyAddress);
    await save(deploy_ids_2.POOL_CONFIGURATOR_PROXY_ID, {
        ...proxyArtifact,
        address: poolConfiguratorProxyAddress,
    });
    if ((0, market_config_helpers_1.isL2PoolSupported)(poolConfig)) {
        // Deploy L2 Encoder
        await deploy(deploy_ids_2.L2_ENCODER, {
            from: deployer,
            contract: "L2Encoder",
            args: [poolProxyAddress],
            ...env_1.COMMON_DEPLOY_PARAMS,
        });
    }
    // Set Flash Loan premiums
    const poolConfiguratorInstance = (await (0, contract_getters_1.getPoolConfiguratorProxy)()).connect(await hre.ethers.getSigner(deployer));
    // Set total Flash Loan Premium
    await (0, tx_1.waitForTx)(await poolConfiguratorInstance.updateFlashloanPremiumTotal(poolConfig.FlashLoanPremiums.total));
    // Set protocol Flash Loan Premium
    await (0, tx_1.waitForTx)(await poolConfiguratorInstance.updateFlashloanPremiumToProtocol(poolConfig.FlashLoanPremiums.protocol));
    return true;
};
// This script can only be run successfully once per market, core version, and network
func.id = `PoolInitalization:${env_2.MARKET_NAME}:aave-v3-core@${constants_2.V3_CORE_VERSION}`;
func.tags = ["market", "init-pool"];
func.dependencies = ["before-deploy", "core", "periphery-pre", "provider"];
func.skip = async () => (0, market_config_helpers_2.checkRequiredEnvironment)();
exports.default = func;
