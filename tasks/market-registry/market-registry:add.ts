import { task } from "hardhat/config";
import { loadPoolConfig } from "../../helpers/market-config-helpers";

import { addMarketToRegistry } from "../../helpers/init-helpers";

task("market-registry:add", "Provide address provider to registry")
  .addParam("pool")
  .addParam("addressesProvider", `Address of LendingPoolAddressProvider`)
  .setAction(async ({ addressesProvider, pool }, HRE) => {
    const poolConfig = loadPoolConfig(pool);
    const { ProviderId } = poolConfig;

    await addMarketToRegistry(ProviderId, addressesProvider);
  });
