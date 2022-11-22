import { getParamPerNetwork } from "./../../helpers/market-config-helpers";
import { EMPTY_STORAGE_SLOT } from "./../../helpers/constants";
import {
  EMISSION_MANAGER_ID,
  INCENTIVES_STAKED_TOKEN_STRATEGY_ID,
  STAKE_AAVE_PROXY,
} from "./../../helpers/deploy-ids";
import { RewardsController } from "../../typechain/RewardsController";
import { V3_PERIPHERY_VERSION } from "../../helpers/constants";
import {
  INCENTIVES_PULL_REWARDS_STRATEGY_ID,
  INCENTIVES_V2_IMPL_ID,
  INCENTIVES_PROXY_ID,
} from "../../helpers/deploy-ids";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { InitializableAdminUpgradeabilityProxy } from "../../typechain";
import {
  ConfigNames,
  eNetwork,
  loadPoolConfig,
  waitForTx,
} from "../../helpers";
import { MARKET_NAME } from "../../helpers/env";
import { ethers } from "hardhat";

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
  const { deploy } = deployments;
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;
  const isLive = hre.config.networks[network].live;
  const {
    deployer,
    incentivesProxyAdmin,
    incentivesRewardsVault,
    incentivesEmissionManager,
  } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const proxyArtifact = await deploy(INCENTIVES_PROXY_ID, {
    from: deployer,
    contract: "InitializableAdminUpgradeabilityProxy",
    args: [],
    deterministicDeployment: ethers.utils.formatBytes32String("rewards"),
  });

  const emissionManagerArtifact = await deploy(EMISSION_MANAGER_ID, {
    from: deployer,
    contract: "EmissionManager",
    args: [proxyArtifact.address, incentivesEmissionManager],
    ...COMMON_DEPLOY_PARAMS,
  });

  const proxyAdminSlot = await hre.ethers.provider.getStorageAt(
    proxyArtifact.address,
    "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103" // keccak-256 eip1967.proxy.admin sub 1
  );
  if (proxyAdminSlot === EMPTY_STORAGE_SLOT) {
    const incentivesImplArtifact = await deploy(INCENTIVES_V2_IMPL_ID, {
      from: deployer,
      contract: "RewardsController",
      args: [],
      ...COMMON_DEPLOY_PARAMS,
    });

    // Ethers Contract Instances
    const incentivesImpl = (await hre.ethers.getContractAt(
      incentivesImplArtifact.abi,
      incentivesImplArtifact.address
    )) as RewardsController;

    // Call to initialize at implementation contract to prevent others.
    await waitForTx(
      await incentivesImpl.initialize(emissionManagerArtifact.address)
    );

    // Initialize proxy
    const proxy = (await hre.ethers.getContractAt(
      proxyArtifact.abi,
      proxyArtifact.address
    )) as InitializableAdminUpgradeabilityProxy;

    const incentivesInit = incentivesImpl.interface.encodeFunctionData(
      "initialize",
      [emissionManagerArtifact.address]
    );

    await (
      await proxy["initialize(address,address,bytes)"](
        incentivesImplArtifact.address,
        incentivesProxyAdmin,
        incentivesInit
      )
    ).wait();
  }

  if (!isLive) {
    await deploy(INCENTIVES_PULL_REWARDS_STRATEGY_ID, {
      from: deployer,
      contract: "PullRewardsTransferStrategy",
      args: [
        proxyArtifact.address,
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
          proxyArtifact.address,
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

  return true;
};

func.id = `Incentives:${MARKET_NAME}:aave-v3-periphery@${V3_PERIPHERY_VERSION}`;

func.tags = ["market", "IncentivesProxy"];
func.dependencies = [];

export default func;
