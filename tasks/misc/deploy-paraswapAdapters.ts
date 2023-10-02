import { task } from "hardhat/config";
import {
  POOL_ADMIN,
  loadPoolConfig,
  ConfigNames,
  eNetwork,
} from "../../helpers";
import { getParamPerNetwork } from "../../helpers/market-config-helpers";
import { MARKET_NAME } from "../../helpers/env";
import { ZERO_ADDRESS } from "../../helpers/constants";

task(`deploy-paraswap-adapters`, `Deploys the paraswap adapter contracts`)
  .addParam("addressesProvider", "address network provider")

  .setAction(async ({ addressesProvider }, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error("INVALID_CHAIN_ID");
    }

    const network = (
      process.env.FORK ? process.env.FORK : hre.network.name
    ) as eNetwork;

    const { deployer } = await hre.getNamedAccounts();

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

    const poolAdmin = POOL_ADMIN[network];

    const paraSwapLiquiditySwapAdapter = await hre.ethers.deployContract(
      "ParaSwapLiquiditySwapAdapter",
      [addressesProvider, paraswapAugustusRegistry, poolAdmin]
    );
    console.log("deploying paraswap repay adapter");

    const paraSwapRepayAdapter = await hre.ethers.deployContract(
      "ParaSwapRepayAdapter",
      [addressesProvider, paraswapAugustusRegistry, poolAdmin]
    );

    console.log("deploying paraswap swap and withdraw adapter");

    const paraSwapWithdrawSwapAdapter = await hre.ethers.deployContract(
      "ParaSwapWithdrawSwapAdapter",
      [addressesProvider, paraswapAugustusRegistry, poolAdmin]
    );

    console.log(
      `paraSwapLiquiditySwapAdapter deployed at`,
      paraSwapLiquiditySwapAdapter.address
    );
    console.log(
      `paraSwapRepayAdapter deployed at`,
      paraSwapRepayAdapter.address
    );

    console.log(
      "paraSwapWithdrawSwapAdapter",
      paraSwapWithdrawSwapAdapter.address
    );
  });
