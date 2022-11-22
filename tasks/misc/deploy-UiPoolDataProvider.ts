import { deployContract } from "./../../helpers/utilities/tx";
import { task } from "hardhat/config";
import {
  chainlinkAggregatorProxy,
  chainlinkEthUsdAggregatorProxy,
} from "../../helpers/constants";

task(
  `deploy-UiPoolDataProvider`,
  `Deploys the UiPoolDataProviderV3 contract`
).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error("INVALID_CHAIN_ID");
  }

  console.log(
    `\n- UiPoolDataProviderV3 price aggregator: ${
      chainlinkAggregatorProxy[hre.network.name]
    }`
  );
  console.log(
    `\n- UiPoolDataProviderV3 eth/usd price aggregator: ${
      chainlinkEthUsdAggregatorProxy[hre.network.name]
    }`
  );
  console.log(`\n- UiPoolDataProviderV3 deployment`);
  const artifact = await deployContract("UiPoolDataProviderV3", [
    chainlinkAggregatorProxy[hre.network.name],
    chainlinkEthUsdAggregatorProxy[hre.network.name],
  ]);

  console.log("UiPoolDataProviderV3:", artifact.address);
  console.log("Network:", hre.network.name);
});
