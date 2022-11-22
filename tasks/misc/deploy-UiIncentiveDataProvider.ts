import { task } from "hardhat/config";

task(
  `deploy-UiIncentiveDataProvider`,
  `Deploys the UiIncentiveDataProvider contract`
).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error("INVALID_CHAIN_ID");
  }

  console.log(`\n- UiIncentiveDataProvider deployment`);
  const { deployer } = await hre.getNamedAccounts();
  const artifact = await hre.deployments.deploy("UiIncentiveDataProviderV3", {
    from: deployer,
  });

  console.log("UiIncentiveDataProvider deployed at:", artifact.address);
  console.log(`\tFinished UiIncentiveDataProvider deployment`);
});
