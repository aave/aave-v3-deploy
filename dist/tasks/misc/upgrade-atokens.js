"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("./../../helpers/market-config-helpers");
const contract_getters_1 = require("./../../helpers/contract-getters");
const deploy_ids_1 = require("./../../helpers/deploy-ids");
const tx_1 = require("./../../helpers/utilities/tx");
const contract_getters_2 = require("../../helpers/contract-getters");
const tx_2 = require("../../helpers/utilities/tx");
const contract_getters_3 = require("../../helpers/contract-getters");
const config_1 = require("hardhat/config");
const hardhat_config_helpers_1 = require("../../helpers/hardhat-config-helpers");
const env_1 = require("../../helpers/env");
// Returns true if tokens upgraded, false if not
(0, config_1.task)(`upgrade-atokens`)
    .addParam("revision")
    .setAction(async ({ revision }, { deployments, getNamedAccounts, ...hre }) => {
    const { deployer } = await getNamedAccounts();
    const network = hardhat_config_helpers_1.FORK ? hardhat_config_helpers_1.FORK : hre.network.name;
    if (!env_1.MARKET_NAME) {
        console.error("Missing MARKET_NAME env variable. Exiting.");
        return false;
    }
    const { ATokenNamePrefix, SymbolPrefix } = await (0, market_config_helpers_1.loadPoolConfig)(env_1.MARKET_NAME);
    const poolAddressesProvider = await (0, contract_getters_1.getPoolAddressesProvider)(await (0, tx_1.getAddressFromJson)(network, deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID));
    const treasury = await (0, tx_1.getAddressFromJson)(network, deploy_ids_1.TREASURY_PROXY_ID);
    const incentivesController = await (0, tx_1.getAddressFromJson)(network, deploy_ids_1.INCENTIVES_PROXY_ID);
    const protocolDataProvider = await (0, contract_getters_2.getAaveProtocolDataProvider)(await poolAddressesProvider.getPoolDataProvider());
    const poolConfigurator = await (0, contract_getters_3.getPoolConfiguratorProxy)(await poolAddressesProvider.getPoolConfigurator());
    const reserves = await protocolDataProvider.getAllReservesTokens();
    const newAtokenArtifact = await deployments.deploy(deploy_ids_1.ATOKEN_IMPL_ID, {
        contract: "AToken",
        from: deployer,
        args: [await poolAddressesProvider.getPool()],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const deployedRevision = await (await (await (0, contract_getters_1.getAToken)(newAtokenArtifact.address)).ATOKEN_REVISION()).toString();
    if (deployedRevision !== revision) {
        console.error(`- Deployed AToken implementation revision ${deployedRevision} does not match expected revision ${revision}`);
        return false;
    }
    for (let x = 0; x < reserves.length; x++) {
        const [symbol, asset] = reserves[x];
        console.log(`- Updating a${symbol}...`);
        await (0, tx_2.waitForTx)(await poolConfigurator.updateAToken({
            asset,
            treasury,
            incentivesController,
            name: `Aave ${ATokenNamePrefix} ${symbol}`,
            symbol: `a${SymbolPrefix}${symbol}`,
            implementation: newAtokenArtifact.address,
            params: [],
        }));
        console.log(`  - Updated implementation of a${symbol}`);
    }
});
