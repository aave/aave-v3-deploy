import { getReserveAddress } from "./../../helpers/market-config-helpers";
import { task } from "hardhat/config";
import { waitForTx } from "../../helpers/utilities/tx";
import {
  ConfigNames,
  loadPoolConfig,
} from "../../helpers/market-config-helpers";
import { getPoolConfiguratorProxy } from "../../helpers/contract-getters";
import { BigNumber } from "ethers";
import { MARKET_NAME } from "../../helpers/env";

task(
  `setup-debt-ceiling`,
  `Setups reserve debt ceiling from configuration`
).setAction(async (_, hre) => {
  const { poolAdmin } = await hre.getNamedAccounts();
  const config = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const poolConfigurator = (await getPoolConfiguratorProxy()).connect(
    await hre.ethers.getSigner(poolAdmin)
  );

  let assetsWithCeiling = [];
  for (let asset in config.ReservesConfig) {
    const debtCeiling = BigNumber.from(
      config.ReservesConfig[asset].debtCeiling
    );
    const assetAddress = await getReserveAddress(config, asset);

    if (debtCeiling.gt("0")) {
      await waitForTx(
        await poolConfigurator.setDebtCeiling(assetAddress, debtCeiling)
      );
      console.log(
        "- Updated debt ceiling of",
        asset,
        "at",
        (Number(config.ReservesConfig[asset].debtCeiling) / 100).toLocaleString(
          undefined,
          { minimumFractionDigits: 2 }
        )
      );
      assetsWithCeiling.push(asset);
    }
  }

  if (assetsWithCeiling.length) {
    console.log(
      "- Successfully setup debt ceiling:",
      assetsWithCeiling.join(", ")
    );
  } else {
    console.log(
      "- None of the assets has debt ceiling enabled at market configuration"
    );
  }
});
