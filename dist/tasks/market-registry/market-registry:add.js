"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const init_helpers_1 = require("../../helpers/init-helpers");
(0, config_1.task)("market-registry:add", "Provide address provider to registry")
    .addParam("pool")
    .addParam("addressesProvider", `Address of LendingPoolAddressProvider`)
    .setAction(async ({ addressesProvider, pool }, HRE) => {
    const poolConfig = (0, market_config_helpers_1.loadPoolConfig)(pool);
    const { ProviderId } = poolConfig;
    await (0, init_helpers_1.addMarketToRegistry)(ProviderId, addressesProvider);
});
