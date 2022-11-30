import {
  getOracleByAsset,
  getReserveAddress,
} from "../../helpers/market-config-helpers";
import { task } from "hardhat/config";
import { waitForTx } from "../../helpers/utilities/tx";
import {
  ConfigNames,
  loadPoolConfig,
} from "../../helpers/market-config-helpers";
import { getPoolConfiguratorProxy } from "../../helpers/contract-getters";
import { MARKET_NAME } from "../../helpers/env";
import { ZERO_ADDRESS } from "../../helpers";

task(`setup-e-modes`, `Setups e-modes from config`).setAction(
  async (_, hre) => {
    const config = await loadPoolConfig(MARKET_NAME as ConfigNames);
    const { poolAdmin } = await hre.getNamedAccounts();
    const poolConfigurator = (await getPoolConfiguratorProxy()).connect(
      await hre.ethers.getSigner(poolAdmin)
    );

    for (let key in config.EModes) {
      const eMode = config.EModes[key];
      let oracle = ZERO_ADDRESS;

      if (eMode.oracleId) {
        oracle = await getOracleByAsset(config, eMode.oracleId);
      }

      await waitForTx(
        await poolConfigurator.setEModeCategory(
          eMode.id,
          eMode.ltv,
          eMode.liquidationThreshold,
          eMode.liquidationBonus,
          oracle,
          eMode.label
        )
      );

      console.log("- Added E-Mode:");
      console.log("  - Label:", eMode.label);
      console.log("  - Id:", eMode.id);
      console.log("  - LTV:", eMode.ltv);
      console.log("  - LQT:", eMode.liquidationThreshold);
      console.log("  - LQB:", eMode.liquidationBonus);
      console.log("  - Oracle:", eMode.oracleId, "with address", oracle);

      for (let assetIndex in eMode.assets) {
        const asset = eMode.assets[assetIndex];
        const assetAddress = await getReserveAddress(config, asset);
        await waitForTx(
          await poolConfigurator.setAssetEModeCategory(assetAddress, eMode.id)
        );
        console.log("  - Added", asset, "asset to E-Mode", eMode.label);
      }
    }
  }
);
