"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_getters_1 = require("./../../helpers/contract-getters");
const tx_1 = require("../../helpers/utilities/tx");
const config_1 = require("hardhat/config");
const hardhat_config_helpers_1 = require("../../helpers/hardhat-config-helpers");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const utils_1 = require("ethers/lib/utils");
const constants_1 = require("../../helpers/constants");
(0, config_1.task)(`set-fallback-oracle`)
    .addOptionalParam("address")
    .setAction(async ({ address }, { deployments, getNamedAccounts, ...hre }) => {
    const { poolAdmin } = await getNamedAccounts();
    const network = hardhat_config_helpers_1.FORK ? hardhat_config_helpers_1.FORK : hre.network.name;
    const signer = await hre.ethers.provider.getSigner(poolAdmin);
    const newFallbackOracleAddress = address
        ? (0, utils_1.getAddress)(address)
        : constants_1.ZERO_ADDRESS;
    const aaveOracle = await (await (0, contract_getters_1.getAaveOracle)(await (0, tx_1.getAddressFromJson)(network, deploy_ids_1.ORACLE_ID))).connect(signer);
    await (0, tx_1.waitForTx)(await aaveOracle.setFallbackOracle(newFallbackOracleAddress));
    const updatedFallbackOracle = await aaveOracle.getFallbackOracle();
    console.table({
        "Fallback oracle": updatedFallbackOracle,
        assert: updatedFallbackOracle === newFallbackOracleAddress,
    });
});
