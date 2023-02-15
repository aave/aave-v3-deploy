"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../helpers/env");
const constants_1 = require("../../helpers/constants");
const tx_1 = require("../../helpers/utilities/tx");
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const env_2 = require("../../helpers/env");
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer, poolAdmin, aclAdmin, emergencyAdmin } = await getNamedAccounts();
    const aclAdminSigner = await hre.ethers.getSigner(aclAdmin);
    const addressesProviderArtifact = await deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID);
    const addressesProviderInstance = (await hre.ethers.getContractAt(addressesProviderArtifact.abi, addressesProviderArtifact.address)).connect(await hre.ethers.getSigner(deployer));
    // 1. Set ACL admin at AddressesProvider
    await (0, tx_1.waitForTx)(await addressesProviderInstance.setACLAdmin(aclAdmin));
    // 2. Deploy ACLManager and setup administrators
    const aclManagerArtifact = await deploy(deploy_ids_1.ACL_MANAGER_ID, {
        from: deployer,
        contract: "ACLManager",
        args: [addressesProviderArtifact.address],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const aclManager = (await hre.ethers.getContractAt(aclManagerArtifact.abi, aclManagerArtifact.address)).connect(aclAdminSigner);
    // 3. Setup ACLManager at AddressesProviderInstance
    await (0, tx_1.waitForTx)(await addressesProviderInstance.setACLManager(aclManager.address));
    // 4. Add PoolAdmin to ACLManager contract
    await (0, tx_1.waitForTx)(await aclManager.connect(aclAdminSigner).addPoolAdmin(poolAdmin));
    // 5. Add EmergencyAdmin  to ACLManager contract
    await (0, tx_1.waitForTx)(await aclManager.connect(aclAdminSigner).addEmergencyAdmin(emergencyAdmin));
    const isACLAdmin = await aclManager.hasRole(constants_1.ZERO_BYTES_32, aclAdmin);
    const isPoolAdmin = await aclManager.isPoolAdmin(poolAdmin);
    const isEmergencyAdmin = await aclManager.isEmergencyAdmin(emergencyAdmin);
    if (!isACLAdmin)
        throw "[ACL][ERROR] ACLAdmin is not setup correctly";
    if (!isPoolAdmin)
        throw "[ACL][ERROR] PoolAdmin is not setup correctly";
    if (!isEmergencyAdmin)
        throw "[ACL][ERROR] EmergencyAdmin is not setup correctly";
    console.log("== Market Admins ==");
    console.log("- ACL Admin", aclAdmin);
    console.log("- Pool Admin", poolAdmin);
    console.log("- Emergency Admin", emergencyAdmin);
    return true;
};
// This script can only be run successfully once per market, core version, and network
func.id = `ACLManager:${env_2.MARKET_NAME}:aave-v3-core@${constants_1.V3_CORE_VERSION}`;
func.tags = ["market", "acl"];
func.dependencies = ["before-deploy", "core", "periphery-pre", "provider"];
func.skip = async () => (0, market_config_helpers_1.checkRequiredEnvironment)();
exports.default = func;
