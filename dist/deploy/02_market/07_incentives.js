"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("./../../helpers/market-config-helpers");
const constants_1 = require("./../../helpers/constants");
const deploy_ids_1 = require("./../../helpers/deploy-ids");
const constants_2 = require("../../helpers/constants");
const deploy_ids_2 = require("../../helpers/deploy-ids");
const env_1 = require("../../helpers/env");
const helpers_1 = require("../../helpers");
const env_2 = require("../../helpers/env");
/**
 * @notice An incentives proxy can be deployed per network or per market.
 * You need to take care to upgrade the incentives proxy to the desired implementation,
 * following the IncentivesController interface to be compatible with ATokens or Debt Tokens.
 */
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { save, deploy } = deployments;
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    const isLive = hre.config.networks[network].live;
    const { deployer, incentivesRewardsVault, incentivesEmissionManager } = await getNamedAccounts();
    const poolConfig = await (0, helpers_1.loadPoolConfig)(env_2.MARKET_NAME);
    const proxyArtifact = await deployments.getExtendedArtifact("InitializableImmutableAdminUpgradeabilityProxy");
    const { address: addressesProvider } = await deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID);
    const addressesProviderInstance = (await (0, helpers_1.getContract)("PoolAddressesProvider", addressesProvider)).connect(await hre.ethers.getSigner(deployer));
    // Deploy EmissionManager
    const emissionManagerArtifact = await deploy(deploy_ids_1.EMISSION_MANAGER_ID, {
        from: deployer,
        contract: "EmissionManager",
        args: [deployer],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const emissionManager = (await hre.ethers.getContractAt(emissionManagerArtifact.abi, emissionManagerArtifact.address));
    // Deploy Incentives Implementation
    const incentivesImplArtifact = await deploy(deploy_ids_2.INCENTIVES_V2_IMPL_ID, {
        from: deployer,
        contract: "RewardsController",
        args: [emissionManagerArtifact.address],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const incentivesImpl = (await hre.ethers.getContractAt(incentivesImplArtifact.abi, incentivesImplArtifact.address));
    // Call to initialize at implementation contract to prevent others.
    await (0, helpers_1.waitForTx)(await incentivesImpl.initialize(constants_1.ZERO_ADDRESS));
    // The Rewards Controller must be set at PoolAddressesProvider with id keccak256("INCENTIVES_CONTROLLER"):
    // 0x703c2c8634bed68d98c029c18f310e7f7ec0e5d6342c590190b3cb8b3ba54532
    const incentivesControllerId = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("INCENTIVES_CONTROLLER"));
    const isRewardsProxyPending = (await addressesProviderInstance.getAddress(incentivesControllerId)) ===
        constants_1.ZERO_ADDRESS;
    if (isRewardsProxyPending) {
        const setRewardsAsProxyTx = await (0, helpers_1.waitForTx)(await addressesProviderInstance.setAddressAsProxy(incentivesControllerId, incentivesImpl.address));
        const proxyAddress = await addressesProviderInstance.getAddress(incentivesControllerId);
        await save(deploy_ids_2.INCENTIVES_PROXY_ID, {
            ...proxyArtifact,
            address: proxyAddress,
        });
        deployments.log(`[Deployment] Attached Rewards implementation and deployed proxy contract: `);
        deployments.log("- Tx hash:", setRewardsAsProxyTx.transactionHash);
    }
    const { address: rewardsProxyAddress } = await deployments.get(deploy_ids_2.INCENTIVES_PROXY_ID);
    // Init RewardsController address
    await (0, helpers_1.waitForTx)(await emissionManager.setRewardsController(rewardsProxyAddress));
    if (!isLive) {
        await deploy(deploy_ids_2.INCENTIVES_PULL_REWARDS_STRATEGY_ID, {
            from: deployer,
            contract: "PullRewardsTransferStrategy",
            args: [
                rewardsProxyAddress,
                incentivesEmissionManager,
                incentivesRewardsVault,
            ],
            ...env_1.COMMON_DEPLOY_PARAMS,
        });
        const stakedAaveAddress = isLive
            ? (0, market_config_helpers_1.getParamPerNetwork)(poolConfig.StkAaveProxy, network)
            : (await deployments.getOrNull(deploy_ids_1.STAKE_AAVE_PROXY))?.address;
        if (stakedAaveAddress) {
            await deploy(deploy_ids_1.INCENTIVES_STAKED_TOKEN_STRATEGY_ID, {
                from: deployer,
                contract: "StakedTokenTransferStrategy",
                args: [
                    rewardsProxyAddress,
                    incentivesEmissionManager,
                    stakedAaveAddress,
                ],
                ...env_1.COMMON_DEPLOY_PARAMS,
            });
        }
        else {
            console.log("[WARNING] Missing StkAave address. Skipping StakedTokenTransferStrategy deployment.");
        }
    }
    // Transfer emission manager ownership
    await (0, helpers_1.waitForTx)(await emissionManager.transferOwnership(incentivesEmissionManager));
    return true;
};
func.id = `Incentives:${env_2.MARKET_NAME}:aave-v3-periphery@${constants_2.V3_PERIPHERY_VERSION}`;
func.tags = ["market", "IncentivesProxy"];
func.dependencies = [];
exports.default = func;
