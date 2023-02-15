"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_getters_1 = require("../../helpers/contract-getters");
const env_1 = require("../../helpers/env");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const env_2 = require("../../helpers/env");
const helpers_1 = require("../../helpers");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const poolConfig = await (0, helpers_1.loadPoolConfig)(env_2.MARKET_NAME);
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    if (!(0, helpers_1.isL2PoolSupported)(poolConfig)) {
        console.log(`[INFO] Skipped L2 Pool due current network '${network}' is not supported`);
        return;
    }
    const { address: addressesProviderAddress } = await deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID);
    const commonLibraries = await (0, contract_getters_1.getPoolLibraries)();
    // Deploy L2 libraries
    const calldataLogicLibrary = await deploy("CalldataLogic", {
        from: deployer,
    });
    // Deploy L2 supported Pool
    const poolArtifact = await deploy(deploy_ids_1.L2_POOL_IMPL_ID, {
        contract: "L2Pool",
        from: deployer,
        args: [addressesProviderAddress],
        libraries: {
            ...commonLibraries,
            CalldataLogic: calldataLogicLibrary.address,
        },
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    // Initialize implementation
    const pool = await (0, contract_getters_1.getPool)(poolArtifact.address);
    await (0, helpers_1.waitForTx)(await pool.initialize(addressesProviderAddress));
    console.log("Initialized L2Pool Implementation");
};
func.id = "L2PoolImplementations";
func.tags = ["market"];
exports.default = func;
