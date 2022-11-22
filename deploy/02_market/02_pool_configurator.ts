import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  POOL_CONFIGURATOR_IMPL_ID,
  RESERVES_SETUP_HELPER_ID,
} from "../../helpers/deploy-ids";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const configuratorLogicArtifact = await get("ConfiguratorLogic");

  await deploy(POOL_CONFIGURATOR_IMPL_ID, {
    contract: "PoolConfigurator",
    from: deployer,
    args: [],
    libraries: {
      ConfiguratorLogic: configuratorLogicArtifact.address,
    },
    ...COMMON_DEPLOY_PARAMS,
  });

  await deploy(RESERVES_SETUP_HELPER_ID, {
    from: deployer,
    args: [],
    contract: "ReservesSetupHelper",
  });
};

func.id = "PoolConfigurator";
func.tags = ["market"];

export default func;
