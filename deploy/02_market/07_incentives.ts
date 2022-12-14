import { getParamPerNetwork } from "./../../helpers/market-config-helpers";
import { EMPTY_STORAGE_SLOT, ZERO_ADDRESS } from "./../../helpers/constants";
import {
  EMISSION_MANAGER_ID,
  INCENTIVES_STAKED_TOKEN_STRATEGY_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  STAKE_AAVE_PROXY,
} from "./../../helpers/deploy-ids";
import {
  EmissionManager,
  PoolAddressesProvider,
  RewardsController,
} from "../../typechain";
import { V3_PERIPHERY_VERSION } from "../../helpers/constants";
import {
  INCENTIVES_PULL_REWARDS_STRATEGY_ID,
  INCENTIVES_V2_IMPL_ID,
  INCENTIVES_PROXY_ID,
} from "../../helpers/deploy-ids";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  ConfigNames,
  eNetwork,
  getContract,
  loadPoolConfig,
  waitForTx,
} from "../../helpers";
import { MARKET_NAME } from "../../helpers/env";

/**
 * @notice An incentives proxy can be deployed per network or per market.
 * You need to take care to upgrade the incentives proxy to the desired implementation,
 * following the IncentivesController interface to be compatible with ATokens or Debt Tokens.
 */
const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { save, deploy } = deployments;
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;
  const isLive = hre.config.networks[network].live;
  const { deployer, incentivesRewardsVault, incentivesEmissionManager } =
    await getNamedAccounts();

  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const proxyArtifact = await deployments.getExtendedArtifact(
    "InitializableImmutableAdminUpgradeabilityProxy"
  );

  const { address: addressesProvider } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  const addressesProviderInstance = (
    await getContract("PoolAddressesProvider", addressesProvider)
  ).connect(await hre.ethers.getSigner(deployer)) as PoolAddressesProvider;

  // Deploy EmissionManager
  const emissionManagerArtifact = await deploy(EMISSION_MANAGER_ID, {
    from: deployer,
    contract: "EmissionManager",
    args: [deployer],
    ...COMMON_DEPLOY_PARAMS,
  });
  const emissionManager = (await hre.ethers.getContractAt(
    emissionManagerArtifact.abi,
    emissionManagerArtifact.address
  )) as EmissionManager;

  // Deploy Incentives Implementation
  const incentivesImplArtifact = await deploy(INCENTIVES_V2_IMPL_ID, {
    from: deployer,
    contract: "RewardsController",
    args: [emissionManagerArtifact.address],
    ...COMMON_DEPLOY_PARAMS,
  });
  const incentivesImpl = (await hre.ethers.getContractAt(
    incentivesImplArtifact.abi,
    incentivesImplArtifact.address
  )) as RewardsController;

  // Call to initialize at implementation contract to prevent others.
  await waitForTx(await incentivesImpl.initialize(ZERO_ADDRESS));

  // The Rewards Controller must be set at PoolAddressesProvider with id keccak256("INCENTIVES_CONTROLLER"):
  // 0x703c2c8634bed68d98c029c18f310e7f7ec0e5d6342c590190b3cb8b3ba54532
  const incentivesControllerId = hre.ethers.utils.keccak256(
    hre.ethers.utils.toUtf8Bytes("INCENTIVES_CONTROLLER")
  );

  const isRewardsProxyPending =
    (await addressesProviderInstance.getAddress(incentivesControllerId)) ===
    ZERO_ADDRESS;

  if (isRewardsProxyPending) {
    const setRewardsAsProxyTx = await waitForTx(
      await addressesProviderInstance.setAddressAsProxy(
        incentivesControllerId,
        incentivesImpl.address
      )
    );

    const proxyAddress = await addressesProviderInstance.getAddress(
      incentivesControllerId
    );
    await save(INCENTIVES_PROXY_ID, {
      ...proxyArtifact,
      address: proxyAddress,
    });

    deployments.log(
      `[Deployment] Attached Rewards implementation and deployed proxy contract: `
    );
    deployments.log("- Tx hash:", setRewardsAsProxyTx.transactionHash);
  }

  const { address: rewardsProxyAddress } = await deployments.get(
    INCENTIVES_PROXY_ID
  );

  // Init RewardsController address
  await waitForTx(
    await emissionManager.setRewardsController(rewardsProxyAddress)
  );

  if (!isLive) {
    await deploy(INCENTIVES_PULL_REWARDS_STRATEGY_ID, {
      from: deployer,
      contract: "PullRewardsTransferStrategy",
      args: [
        rewardsProxyAddress,
        incentivesEmissionManager,
        incentivesRewardsVault,
      ],
      ...COMMON_DEPLOY_PARAMS,
    });
    const stakedAaveAddress = isLive
      ? getParamPerNetwork(poolConfig.StkAaveProxy, network)
      : (await deployments.getOrNull(STAKE_AAVE_PROXY))?.address;

    if (stakedAaveAddress) {
      await deploy(INCENTIVES_STAKED_TOKEN_STRATEGY_ID, {
        from: deployer,
        contract: "StakedTokenTransferStrategy",
        args: [
          rewardsProxyAddress,
          incentivesEmissionManager,
          stakedAaveAddress,
        ],
        ...COMMON_DEPLOY_PARAMS,
      });
    } else {
      console.log(
        "[WARNING] Missing StkAave address. Skipping StakedTokenTransferStrategy deployment."
      );
    }
  }

  // Transfer emission manager ownership

  await waitForTx(
    await emissionManager.transferOwnership(incentivesEmissionManager)
  );

  return true;
};

func.id = `Incentives:${MARKET_NAME}:aave-v3-periphery@${V3_PERIPHERY_VERSION}`;

func.tags = ["market", "IncentivesProxy"];
func.dependencies = [];

export default func;
