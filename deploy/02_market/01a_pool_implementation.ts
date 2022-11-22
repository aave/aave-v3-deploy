import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_IMPL_ID,
} from "../../helpers/deploy-ids";
import { MARKET_NAME } from "../../helpers/env";
import {
  ConfigNames,
  eNetwork,
  getPoolLibraries,
  isL2PoolSupported,
  loadPoolConfig,
} from "../../helpers";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  const { address: addressesProviderAddress } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  if (isL2PoolSupported(poolConfig)) {
    console.log(
      `[INFO] Skipped common Pool due current network '${network}' is not supported`
    );
    return;
  }
  const commonLibraries = await getPoolLibraries();

  // Deploy common Pool contract
  await deploy(POOL_IMPL_ID, {
    contract: "Pool",
    from: deployer,
    args: [addressesProviderAddress],
    libraries: {
      ...commonLibraries,
    },
    ...COMMON_DEPLOY_PARAMS,
  });
};

func.id = "PoolImplementation";
func.tags = ["market"];

export default func;
