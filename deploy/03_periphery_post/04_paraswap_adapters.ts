import { getParamPerNetwork } from "../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  ConfigNames,
  eNetwork,
  GOVERNANCE_BRIDGE_EXECUTOR,
  loadPoolConfig,
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_ADMIN,
  V3_PERIPHERY_VERSION,
} from "../../helpers";
import { MARKET_NAME } from "../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const paraswapAugustusRegistry = getParamPerNetwork(
    poolConfig.ParaswapRegistry,
    network
  );

  if (!paraswapAugustusRegistry) {
    console.log(
      "[WARNING] Skipping the deployment of the Paraswap adapters due missing 'ParaswapRegistry' address at pool configuration."
    );
    return;
  }

  const { address: addressesProvider } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );
  const poolAdmin = GOVERNANCE_BRIDGE_EXECUTOR[network] || POOL_ADMIN[network];

  await deploy("ParaSwapLiquiditySwapAdapter", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
    args: [addressesProvider, paraswapAugustusRegistry, poolAdmin],
  });

  await deploy("ParaSwapRepayAdapter", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
    args: [addressesProvider, paraswapAugustusRegistry, poolAdmin],
  });

  await deploy("ParaSwapWithdrawSwapAdapter", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
    args: [addressesProvider, paraswapAugustusRegistry, poolAdmin],
  });

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `ParaswapAdapters:${MARKET_NAME}:aave-v3-periphery@${V3_PERIPHERY_VERSION}`;

func.tags = ["periphery-post", "paraswap-adapters"];

export default func;
