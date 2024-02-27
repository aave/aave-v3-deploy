import { task } from "hardhat/config";
import {
  ConfigNames,
  eNetwork,
  loadPoolConfig,
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_ADMIN,
  V3_PERIPHERY_VERSION,
} from "../../helpers";
import { deployContract } from "./../../helpers/utilities/tx";

import { getParamPerNetwork } from "../../helpers/market-config-helpers";
import { MARKET_NAME } from "../../helpers/env";

task(`deploy-paraswap-adapters`, `Deploys all paraswap adapters`).setAction(
  async (_, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error("INVALID_CHAIN_ID");
    }
    await hre.run("deploy-paraswap-liquidity-swap-adapter");
    await hre.run("deploy-paraswap-repay-adapter");
    await hre.run("deploy-paraswap-withdraw-adapter");
  }
);

task(
  `deploy-paraswap-liquidity-swap-adapter`,
  `Deploys paraswap liquidity swap adapter`
).setAction(async (_, hre) => {
  const { deployer } = await hre.getNamedAccounts();

  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  console.log("poolConfig", poolConfig);

  const paraswapAugustusRegistry = getParamPerNetwork(
    poolConfig.ParaswapRegistry,
    network
  );

  if (!paraswapAugustusRegistry) {
    console.log(
      "[WARNING] Skipping the deployment of the Paraswap Liquidity Swap and Repay adapters due missing 'ParaswapRegistry' address at pool configuration."
    );
    return;
  }

  const { address: addressesProvider } = await hre.deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );
  const poolAdmin = POOL_ADMIN[network];

  console.log("poolAdmin", poolAdmin);

  const artifact = await deployContract("ParaSwapLiquiditySwapAdapter", [
    addressesProvider,
    paraswapAugustusRegistry,
    poolAdmin,
  ]);

  console.log("ParaSwapLiquiditySwapAdapter Address", artifact.address);
});

task(
  `deploy-paraswap-repay-adapter`,
  `Deploys paraswap repay swap adapter`
).setAction(async (_, hre) => {
  const { deployer } = await hre.getNamedAccounts();

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
      "[WARNING] Skipping the deployment of the Paraswap Liquidity Swap and Repay adapters due missing 'ParaswapRegistry' address at pool configuration."
    );
    return;
  }

  const { address: addressesProvider } = await hre.deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );
  const poolAdmin = POOL_ADMIN[network];

  const artifact = await deployContract("ParaSwapRepayAdapter", [
    addressesProvider,
    paraswapAugustusRegistry,
    poolAdmin,
  ]);
  console.log("ParaSwapRepayAdapter Address", artifact.address);
});

task(
  `deploy-paraswap-withdraw-adapter`,
  `Deploys paraswap withdraw swap adapter`
).setAction(async (_, hre) => {
  const { deployer } = await hre.getNamedAccounts();

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
      "[WARNING] Skipping the deployment of the Paraswap Liquidity Swap and Repay adapters due missing 'ParaswapRegistry' address at pool configuration."
    );
    return;
  }

  const { address: addressesProvider } = await hre.deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );
  const poolAdmin = POOL_ADMIN[network];

  const artifact = await deployContract("ParaSwapWithdrawSwapAdapter", [
    addressesProvider,
    paraswapAugustusRegistry,
    poolAdmin,
  ]);
  console.log("ParaSwapWithdrawSwapAdapter Address", artifact.address);
});
