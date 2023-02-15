"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../helpers/env");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const helpers_1 = require("../../helpers");
const func = async function ({ getNamedAccounts, deployments, }) {
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const { address: addressesProviderAddress } = await deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID);
    const configuratorLogicArtifact = await get("ConfiguratorLogic");
    const poolConfigArtifact = await deploy(deploy_ids_1.POOL_CONFIGURATOR_IMPL_ID, {
        contract: "PoolConfigurator",
        from: deployer,
        args: [],
        libraries: {
            ConfiguratorLogic: configuratorLogicArtifact.address,
        },
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    // Initialize implementation
    const poolConfig = await (0, helpers_1.getPoolConfiguratorProxy)(poolConfigArtifact.address);
    await (0, helpers_1.waitForTx)(await poolConfig.initialize(addressesProviderAddress));
    console.log("Initialized PoolConfigurator Implementation");
    await deploy(deploy_ids_1.RESERVES_SETUP_HELPER_ID, {
        from: deployer,
        args: [],
        contract: "ReservesSetupHelper",
    });
    return true;
};
func.id = "PoolConfigurator";
func.tags = ["market"];
exports.default = func;
