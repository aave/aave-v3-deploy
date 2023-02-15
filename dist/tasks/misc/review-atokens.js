"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_getters_1 = require("../../helpers/contract-getters");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const tx_1 = require("../../helpers/utilities/tx");
const contract_getters_2 = require("../../helpers/contract-getters");
const config_1 = require("hardhat/config");
const hardhat_config_helpers_1 = require("../../helpers/hardhat-config-helpers");
(0, config_1.task)(`review-atokens`)
    .addFlag("log")
    .setAction(async ({ log }, { deployments, getNamedAccounts, ...hre }) => {
    console.log("start review");
    const network = hardhat_config_helpers_1.FORK ? hardhat_config_helpers_1.FORK : hre.network.name;
    const poolAddressesProvider = await (0, contract_getters_1.getPoolAddressesProvider)(await (0, tx_1.getAddressFromJson)(network, deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID));
    const protocolDataProvider = await (0, contract_getters_2.getAaveProtocolDataProvider)(await poolAddressesProvider.getPoolDataProvider());
    const reserves = await protocolDataProvider.getAllATokens();
    const ATokenConfigs = {};
    for (let x = 0; x < reserves.length; x++) {
        const [symbol, asset] = reserves[x];
        const aToken = await (0, contract_getters_1.getAToken)(asset);
        ATokenConfigs[symbol] = {
            name: await aToken.name(),
            symbol: await aToken.symbol(),
            decimals: (await aToken.decimals()).toString(),
            revision: (await aToken.ATOKEN_REVISION()).toString(),
            treasury: await aToken.RESERVE_TREASURY_ADDRESS(),
            incentives: await aToken.getIncentivesController(),
            underlying: await aToken.UNDERLYING_ASSET_ADDRESS(),
            pool: await aToken.POOL(),
        };
    }
    if (log) {
        console.log("ATokens Config:");
        console.table(ATokenConfigs);
    }
    return ATokenConfigs;
});
