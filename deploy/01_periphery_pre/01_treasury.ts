import { ZERO_ADDRESS } from "../../helpers/constants";
import {
  TREASURY_CONTROLLER_ID,
  TREASURY_IMPL_ID,
} from "../../helpers/deploy-ids";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { TREASURY_PROXY_ID } from "../../helpers/deploy-ids";
import {
  InitializableAdminUpgradeabilityProxy,
  waitForTx,
} from "../../helpers";
import { AaveEcosystemReserveV2 } from "../../typechain";

/**
 * @notice A treasury proxy can be deployed per network or per market.
 * You need to take care to upgrade this proxy to the desired implementation.
 */

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer, treasuryProxyAdmin } = await getNamedAccounts();

  // Deploy Treasury proxy
  const treasuryProxyArtifact = await deploy(TREASURY_PROXY_ID, {
    from: deployer,
    contract: "InitializableAdminUpgradeabilityProxy",
    args: [],
  });

  // Deploy Treasury Controller
  const treasuryController = await deploy(TREASURY_CONTROLLER_ID, {
    from: deployer,
    contract: "AaveEcosystemReserveController",
    args: [treasuryProxyAdmin],
    ...COMMON_DEPLOY_PARAMS,
  });

  // Deploy Treasury implementation and initialize proxy
  const treasuryImplArtifact = await deploy(TREASURY_IMPL_ID, {
    from: deployer,
    contract: "AaveEcosystemReserveV2",
    args: [],
    ...COMMON_DEPLOY_PARAMS,
  });

  const treasuryImpl = (await hre.ethers.getContractAt(
    treasuryImplArtifact.abi,
    treasuryImplArtifact.address
  )) as AaveEcosystemReserveV2;

  // Call to initialize at implementation contract to prevent other calls.
  await waitForTx(await treasuryImpl.initialize(ZERO_ADDRESS));

  // Initialize proxy
  const proxy = (await hre.ethers.getContractAt(
    treasuryProxyArtifact.abi,
    treasuryProxyArtifact.address
  )) as InitializableAdminUpgradeabilityProxy;

  const initializePayload = treasuryImpl.interface.encodeFunctionData(
    "initialize",
    [treasuryController.address]
  );

  await waitForTx(
    await proxy["initialize(address,address,bytes)"](
      treasuryImplArtifact.address,
      treasuryProxyAdmin,
      initializePayload
    )
  );

  return true;
};

func.tags = ["periphery-pre", "TreasuryProxy"];
func.dependencies = [];
func.id = "Treasury";

export default func;
