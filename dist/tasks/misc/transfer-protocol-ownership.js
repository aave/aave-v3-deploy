"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../helpers/constants");
const hardhat_config_helpers_1 = require("./../../helpers/hardhat-config-helpers");
const contract_getters_1 = require("./../../helpers/contract-getters");
const config_1 = require("hardhat/config");
const tx_1 = require("../../helpers/utilities/tx");
const process_1 = require("process");
(0, config_1.task)(`transfer-protocol-ownership`, `Transfer the ownership of protocol from deployer`).setAction(async (_, hre) => {
    // Deployer admins
    const { poolAdmin, aclAdmin, deployer, emergencyAdmin, incentivesEmissionManager, treasuryProxyAdmin, addressesProviderRegistryOwner, } = await hre.getNamedAccounts();
    const networkId = hardhat_config_helpers_1.FORK ? hardhat_config_helpers_1.FORK : hre.network.name;
    // Desired Admin at Polygon must be the bridge crosschain executor, not the multisig
    const desiredAdmin = constants_1.POOL_ADMIN[networkId];
    if (!desiredAdmin) {
        console.error("The constant desired Multisig is undefined. Check missing admin address at MULTISIG_ADDRESS or GOVERNANCE_BRIDGE_EXECUTOR constant");
        (0, process_1.exit)(403);
    }
    console.log("--- CURRENT DEPLOYER ADDRESSES ---");
    console.table({
        poolAdmin,
        incentivesEmissionManager,
        treasuryProxyAdmin,
        addressesProviderRegistryOwner,
    });
    console.log("--- DESIRED GOV ADMIN ---");
    console.log(desiredAdmin);
    const aclSigner = await hre.ethers.getSigner(aclAdmin);
    const poolAddressesProvider = await (0, contract_getters_1.getPoolAddressesProvider)();
    const poolAddressesProviderRegistry = await (0, contract_getters_1.getPoolAddressesProviderRegistry)();
    const wrappedGateway = await (0, contract_getters_1.getWrappedTokenGateway)();
    const aclManager = (await (0, contract_getters_1.getACLManager)(await poolAddressesProvider.getACLManager())).connect(aclSigner);
    const emissionManager = await (0, contract_getters_1.getEmissionManager)();
    const currentOwner = await poolAddressesProvider.owner();
    const paraswapSwapAdapter = await (0, contract_getters_1.getOwnableContract)(await (await hre.deployments.get("ParaSwapLiquiditySwapAdapter")).address);
    const paraswapRepayAdapter = await (0, contract_getters_1.getOwnableContract)(await (await hre.deployments.get("ParaSwapRepayAdapter")).address);
    if (currentOwner === desiredAdmin) {
        console.log("- This market already transferred the ownership to desired multisig");
        (0, process_1.exit)(0);
    }
    if (currentOwner !== poolAdmin) {
        console.log("- Accounts loaded doesn't match current Market owner", currentOwner);
        console.log(`  - Market owner loaded from account  :`, poolAdmin);
        console.log(`  - Market owner loaded from pool prov:`, currentOwner);
        (0, process_1.exit)(403);
    }
    /** Start of Paraswap Helpers Ownership */
    const isDeployerAdminParaswapRepayAdapter = (await paraswapRepayAdapter.owner()) == deployer;
    if (isDeployerAdminParaswapRepayAdapter) {
        await paraswapRepayAdapter.transferOwnership(desiredAdmin);
        console.log("- Transferred ParaswapRepayAdapter ownership");
    }
    const isDeployerAdminParaswapSwapAdapter = (await paraswapSwapAdapter.owner()) == deployer;
    if (isDeployerAdminParaswapSwapAdapter) {
        await paraswapSwapAdapter.transferOwnership(desiredAdmin);
        console.log("- Transferred ParaswapSwapAdapter ownership");
    }
    /** End of Paraswap Helpers Ownership */
    /** Start of Emergency Admin transfer */
    const isDeployerEmergencyAdmin = await aclManager.isEmergencyAdmin(emergencyAdmin);
    if (isDeployerEmergencyAdmin) {
        await (0, tx_1.waitForTx)(await aclManager.addEmergencyAdmin(desiredAdmin));
        await (0, tx_1.waitForTx)(await aclManager.removeEmergencyAdmin(emergencyAdmin));
        console.log("- Transferred the ownership of Emergency Admin");
    }
    /** End of Emergency Admin transfer */
    /** Start of Pool Admin transfer */
    const isDeployerPoolAdmin = await aclManager.isPoolAdmin(poolAdmin);
    if (isDeployerPoolAdmin) {
        await (0, tx_1.waitForTx)(await aclManager.addPoolAdmin(desiredAdmin));
        await (0, tx_1.waitForTx)(await aclManager.removePoolAdmin(poolAdmin));
        console.log("- Transferred the ownership of Pool Admin");
    }
    /** End of Pool Admin transfer */
    /** Start of Pool Addresses Provider  Registry transfer ownership */
    const isDeployerACLAdminAtPoolAddressesProviderOwner = (await poolAddressesProvider.getACLAdmin()) === deployer;
    if (isDeployerACLAdminAtPoolAddressesProviderOwner) {
        await poolAddressesProvider.setACLAdmin(desiredAdmin);
        console.log("- Transferred ACL Admin");
    }
    /** Start of Pool Addresses Provider transfer ownership */
    const isDeployerPoolAddressesProviderOwner = (await poolAddressesProvider.owner()) === poolAdmin;
    if (isDeployerPoolAddressesProviderOwner) {
        await poolAddressesProvider.transferOwnership(desiredAdmin);
        console.log("- Transferred of Pool Addresses Provider and Market ownership");
    }
    /** End of Pool Addresses Provider transfer ownership */
    /** Start of Pool Addresses Provider  Registry transfer ownership */
    const isDeployerPoolAddressesProviderRegistryOwner = (await poolAddressesProviderRegistry.owner()) ===
        addressesProviderRegistryOwner;
    if (isDeployerPoolAddressesProviderRegistryOwner) {
        await poolAddressesProviderRegistry.transferOwnership(desiredAdmin);
        console.log("- Transferred of Pool Addresses Provider Registry");
    }
    /** End of Pool Addresses Provider Registry transfer ownership */
    /** Start of WrappedTokenGateway transfer ownership */
    const isDeployerGatewayOwner = (await wrappedGateway.owner()) === poolAdmin;
    if (isDeployerGatewayOwner) {
        await (0, tx_1.waitForTx)(await wrappedGateway.transferOwnership(desiredAdmin));
        console.log("- Transferred WrappedTokenGateway ownership");
    }
    /** End of WrappedTokenGateway ownership */
    /** Start of EmissionManager transfer ownership */
    const isDeployerEmissionManagerOwner = (await emissionManager.owner()) === deployer;
    if (isDeployerEmissionManagerOwner) {
        await emissionManager.transferOwnership(desiredAdmin);
        console.log(`
    - Transferred owner of EmissionManager from ${deployer} to ${desiredAdmin}
    `);
    }
    /** End of EmissionManager transfer ownership */
    /** Start of DEFAULT_ADMIN_ROLE transfer ownership */
    const isDeployerDefaultAdmin = await aclManager.hasRole(hre.ethers.constants.HashZero, deployer);
    if (isDeployerDefaultAdmin) {
        console.log("- Transferring the DEFAULT_ADMIN_ROLE to the multisig address");
        await (0, tx_1.waitForTx)(await aclManager.grantRole(hre.ethers.constants.HashZero, desiredAdmin));
        console.log("- Revoking deployer as DEFAULT_ADMIN_ROLE to the multisig address");
        await (0, tx_1.waitForTx)(await aclManager.revokeRole(hre.ethers.constants.HashZero, deployer));
        console.log("- Revoked DEFAULT_ADMIN_ROLE to deployer ");
    }
    /** End of DEFAULT_ADMIN_ROLE transfer ownership */
    /** Output of results*/
    const result = [
        {
            role: "PoolAdmin",
            address: (await aclManager.isPoolAdmin(desiredAdmin))
                ? desiredAdmin
                : poolAdmin,
            assert: await aclManager.isPoolAdmin(desiredAdmin),
        },
        {
            role: "PoolAddressesProvider owner",
            address: await poolAddressesProvider.owner(),
            assert: (await poolAddressesProvider.owner()) === desiredAdmin,
        },
        {
            role: "WrappedTokenGateway owner",
            address: await wrappedGateway.owner(),
            assert: (await wrappedGateway.owner()) === desiredAdmin,
        },
        {
            role: "EmissionManager owner",
            address: await emissionManager.owner(),
            assert: (await emissionManager.owner()) === desiredAdmin,
        },
        {
            role: "ACL Default Admin role revoked Deployer",
            address: (await aclManager.hasRole(hre.ethers.constants.HashZero, deployer))
                ? "NOT REVOKED"
                : "REVOKED",
            assert: !(await aclManager.hasRole(hre.ethers.constants.HashZero, deployer)),
        },
        {
            role: "ACL Default Admin role granted Multisig",
            address: (await aclManager.hasRole(hre.ethers.constants.HashZero, desiredAdmin))
                ? desiredAdmin
                : (await aclManager.hasRole(hre.ethers.constants.HashZero, deployer))
                    ? deployer
                    : "UNKNOWN",
            assert: await aclManager.hasRole(hre.ethers.constants.HashZero, desiredAdmin),
        },
    ];
    console.table(result);
    return;
});
