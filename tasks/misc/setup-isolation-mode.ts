import { getReserveAddress } from "../../helpers/market-config-helpers";
import { task } from "hardhat/config";
import { waitForTx } from "../../helpers/utilities/tx";
import {
  ConfigNames,
  loadPoolConfig,
} from "../../helpers/market-config-helpers";
import { getPoolConfiguratorProxy } from "../../helpers/contract-getters";
import { MARKET_NAME } from "../../helpers/env";

task(
  `setup-isolation-mode`,
  `Setup isolation mode from configuration`
).setAction(async (_, hre) => {
  const { poolAdmin } = await hre.getNamedAccounts();
  const config = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const poolConfigurator = (await getPoolConfiguratorProxy()).connect(
    await hre.ethers.getSigner(poolAdmin)
  );

  let assetsWithBorrowableIsolationMode = [];
  for (let asset in config.ReservesConfig) {
    const borrowableIsolation =
      config.ReservesConfig[asset].borrowableIsolation;
    const assetAddress = await getReserveAddress(config, asset);

    if (assetAddress && borrowableIsolation) {
      await waitForTx(
        await poolConfigurator.setBorrowableInIsolation(
          assetAddress,
          borrowableIsolation
        )
      );
      assetsWithBorrowableIsolationMode.push(asset);
    }
  }
  if (assetsWithBorrowableIsolationMode.length) {
    console.log(
      "- Successfully setup isolation mode for:",
      assetsWithBorrowableIsolationMode.join(", ")
    );
  } else {
    console.log(
      "- None of the assets has borrowable isolation enabled at market configuration"
    );
  }
});
