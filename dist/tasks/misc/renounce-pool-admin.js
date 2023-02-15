"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../helpers/constants");
const hardhat_config_helpers_1 = require("../../helpers/hardhat-config-helpers");
const contract_getters_1 = require("../../helpers/contract-getters");
const config_1 = require("hardhat/config");
const tx_1 = require("../../helpers/utilities/tx");
const process_1 = require("process");
(0, config_1.task)(`renounce-pool-admin`, `Renounce PoolAdmin role as deployer if `).setAction(async (_, hre) => {
    const { deployer } = await hre.getNamedAccounts();
    const deployerSigner = await hre.ethers.getSigner(deployer);
    const networkId = hardhat_config_helpers_1.FORK ? hardhat_config_helpers_1.FORK : hre.network.name;
    const desiredAdmin = constants_1.POOL_ADMIN[networkId];
    if (!desiredAdmin) {
        console.error("The constant desired admin is undefined. Check missing admin address at MULTISIG_ADDRESS or GOVERNANCE_BRIDGE_EXECUTOR constant");
        (0, process_1.exit)(403);
    }
    console.log("--- CURRENT DEPLOYER  ---");
    console.table({
        deployer,
    });
    console.log("--- DESIRED  ADMIN ---");
    console.log(desiredAdmin);
    const poolAddressesProvider = await (0, contract_getters_1.getPoolAddressesProvider)();
    const aclManager = (await (0, contract_getters_1.getACLManager)(await poolAddressesProvider.getACLManager())).connect(deployerSigner);
    /** Start of Pool Listing Admin transfer ownership */
    const isDeployerPoolAdmin = await aclManager.isPoolAdmin(deployer);
    const isMultisigPoolAdmin = await aclManager.isPoolAdmin(desiredAdmin);
    if (isDeployerPoolAdmin && isMultisigPoolAdmin) {
        const tx = await (0, tx_1.waitForTx)(await aclManager.renounceRole(await aclManager.POOL_ADMIN_ROLE(), deployer));
        console.log("- Deployer renounced PoolAdmin role");
        console.log("- TX:", tx.transactionHash);
    }
    else if (!isDeployerPoolAdmin && isMultisigPoolAdmin) {
        console.log("- The deployer already renounced the Pool Admin role before running this script");
    }
    else if (isDeployerPoolAdmin && !isMultisigPoolAdmin) {
        console.log("- The multisig or guardian must be PoolAdmin before Deployer resigns");
    }
    /** Output of results*/
    const result = [
        {
            role: "Deployer renounced PoolAdmin",
            address: (await aclManager.isPoolAdmin(deployer))
                ? "NOT_RENOUNCED"
                : "RENOUNCED",
            assert: !(await aclManager.isPoolAdmin(deployer)),
        },
        {
            role: "Owner is still PoolAdmin",
            address: (await aclManager.isPoolAdmin(desiredAdmin)) ? "YES" : "NO",
            assert: await aclManager.isPoolAdmin(desiredAdmin),
        },
    ];
    console.table(result);
    return;
});
