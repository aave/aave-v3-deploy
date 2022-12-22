import { eNetwork } from "./../../helpers/types";
import {
  POOL_CONFIGURATOR_PROXY_ID,
  POOL_ADDRESSES_PROVIDER_ID,
} from "../../helpers/deploy-ids";
import { getAddressFromJson, waitForTx } from "../../helpers/utilities/tx";
import {
  getOracleByAsset,
  loadPoolConfig,
} from "../../helpers/market-config-helpers";
import {
  getPool,
  getPoolAddressesProvider,
  getPoolConfiguratorProxy,
} from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import { MARKET_NAME } from "../../helpers/env";
import { FORK } from "../../helpers/hardhat-config-helpers";
import { diff, formatters } from "jsondiffpatch";
import chalk from "chalk";
import { ZERO_ADDRESS } from "../../helpers";

task(`review-e-mode`, ``)
  .addFlag("fix")
  .addParam("id", "ID of EMode Category")
  .setAction(async ({ id, fix }: { id: string; fix: boolean }, hre) => {
    const { poolAdmin } = await hre.getNamedAccounts();
    const network = FORK ? FORK : (hre.network.name as eNetwork);
    const poolConfigurator = (
      await getPoolConfiguratorProxy(
        await getAddressFromJson(network, POOL_CONFIGURATOR_PROXY_ID)
      )
    ).connect(await hre.ethers.getSigner(poolAdmin));
    const poolAddressesProvider = await getPoolAddressesProvider(
      await getAddressFromJson(network, POOL_ADDRESSES_PROVIDER_ID)
    );
    const pool = await getPool(await poolAddressesProvider.getPool());
    const poolConfig = await loadPoolConfig(MARKET_NAME);

    const configEmodeCategory = poolConfig.EModes["StableEMode"];
    const onChainCategory = await pool.getEModeCategoryData(id);

    const expectedCategory = {
      ltv: Number(configEmodeCategory.ltv),
      liquidationThreshold: Number(configEmodeCategory.liquidationThreshold),
      liquidationBonus: Number(configEmodeCategory.liquidationBonus),
      priceSource: configEmodeCategory.oracleId
        ? await getOracleByAsset(poolConfig, configEmodeCategory.oracleId)
        : ZERO_ADDRESS,
      label: onChainCategory.label,
    };
    const currentCategory = {
      ltv: onChainCategory.ltv,
      liquidationThreshold: onChainCategory.liquidationThreshold,
      liquidationBonus: onChainCategory.liquidationBonus,
      priceSource: onChainCategory.priceSource,
      label: onChainCategory.label,
    };

    const delta = diff(currentCategory, expectedCategory);
    if (delta) {
      console.log(
        `- Found ${chalk.red(
          "differences"
        )} at on chain Emode versus expected "${id}" EMODE from local configuration`
      );
      console.log(
        chalk.red(
          "Current strategy",
          "=>",
          chalk.green("Desired strategy from config")
        )
      );
      console.log(formatters.console.format(delta, expectedCategory));

      if (!fix) {
        // early return
        return;
      }

      await waitForTx(
        await poolConfigurator.setEModeCategory(
          id,
          expectedCategory.ltv,
          expectedCategory.liquidationThreshold,
          expectedCategory.liquidationBonus,
          expectedCategory.priceSource,
          expectedCategory.label
        )
      );

      console.log("  - Updated EMode Category");
    } else {
      console.log(
        chalk.green(`  - Emode ID ${id} matches local Emode configuration`)
      );
    }
  });
