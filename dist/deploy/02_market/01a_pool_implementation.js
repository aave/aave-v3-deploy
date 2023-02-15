"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../helpers/env");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const env_2 = require("../../helpers/env");
const helpers_1 = require("../../helpers");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const poolConfig = await (0, helpers_1.loadPoolConfig)(env_2.MARKET_NAME);
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    const { address: addressesProviderAddress } = await deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID);
    if ((0, helpers_1.isL2PoolSupported)(poolConfig)) {
        console.log(`[INFO] Skipped common Pool due current network '${network}' is not supported`);
        return;
    }
    const commonLibraries = await (0, helpers_1.getPoolLibraries)();
    // Deploy common Pool contract
    const poolArtifact = await deploy(deploy_ids_1.POOL_IMPL_ID, {
        contract: "Pool",
        from: deployer,
        args: [addressesProviderAddress],
        libraries: {
            ...commonLibraries,
        },
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    // Initialize implementation
    const pool = await (0, helpers_1.getPool)(poolArtifact.address);
    await (0, helpers_1.waitForTx)(await pool.initialize(addressesProviderAddress));
    console.log("Initialized Pool Implementation");
};
func.id = "PoolImplementation";
func.tags = ["market"];
exports.default = func;
