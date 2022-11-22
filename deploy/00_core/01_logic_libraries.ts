import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SupplyLogic", {
    from: deployer,
    args: [],
    ...COMMON_DEPLOY_PARAMS,
  });

  const borrowLogicArtifact = await deploy("BorrowLogic", {
    from: deployer,
    args: [],
    ...COMMON_DEPLOY_PARAMS,
  });

  await deploy("LiquidationLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  await deploy("EModeLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  await deploy("BridgeLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  await deploy("ConfiguratorLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  await deploy("FlashLoanLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
    libraries: {
      BorrowLogic: borrowLogicArtifact.address,
    },
  });

  await deploy("PoolLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  return true;
};

func.id = "LogicLibraries";
func.tags = ["core", "logic"];

export default func;
