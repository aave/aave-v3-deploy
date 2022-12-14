import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getWalletBalances, isTestnetMarket, loadPoolConfig } from "../helpers";
import { parseEther } from "ethers/lib/utils";
import { MARKET_NAME } from "../helpers/env";

/**
 * The following script runs before the deployment starts
 */

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const poolConfig = loadPoolConfig(MARKET_NAME);

  if (isTestnetMarket(poolConfig)) {
    const { incentivesProxyAdmin } = await getNamedAccounts();
    const proxyAdminBalance = await hre.ethers.provider.getBalance(
      incentivesProxyAdmin
    );
    if (proxyAdminBalance.lt(parseEther("0.05"))) {
      const [deployer] = await hre.ethers.getSigners();
      await (
        await deployer.sendTransaction({
          to: incentivesProxyAdmin,
          value: parseEther("0.07"),
        })
      ).wait();
      console.log("- Sent 0.07 ETH to incentives proxy admin");
    }
  }

  const balances = await getWalletBalances();
  console.log("\nAccounts");
  console.log("========");
  console.table(balances);
};

func.tags = ["before-deploy"];

export default func;
