import { task } from "hardhat/config";

task(`deploy-ui-helpers`, `Deploys all ui helpers`).setAction(
  async (_, hre) => {
    if (!hre.network.config.chainId) {
      throw new Error("INVALID_CHAIN_ID");
    }
    await hre.run("deploy-UiIncentiveDataProvider");
    await hre.run("deploy-UiPoolDataProvider");
  }
);
