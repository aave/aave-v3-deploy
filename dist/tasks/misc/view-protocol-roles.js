"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WrappedTokenGatewayV3__factory_1 = require("./../../typechain/factories/@aave/periphery-v3/contracts/misc/WrappedTokenGatewayV3__factory");
const signer_1 = require("./../../helpers/utilities/signer");
const tx_1 = require("./../../helpers/utilities/tx");
const constants_1 = require("./../../helpers/constants");
const contract_getters_1 = require("./../../helpers/contract-getters");
const hardhat_config_helpers_1 = require("../../helpers/hardhat-config-helpers");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const contract_getters_2 = require("../../helpers/contract-getters");
const config_1 = require("hardhat/config");
const tx_2 = require("../../helpers/utilities/tx");
const process_1 = require("process");
(0, config_1.task)(`view-protocol-roles`, `View current admin of each role and contract`).setAction(async (_, hre) => {
    // Deployer admins
    const { poolAdmin, aclAdmin, emergencyAdmin, deployer } = await hre.getNamedAccounts();
    const deployerSigner = await hre.ethers.getSigner(deployer);
    const aclSigner = await hre.ethers.getSigner(aclAdmin);
    const networkId = hardhat_config_helpers_1.FORK ? hardhat_config_helpers_1.FORK : hre.network.name;
    const desiredAdmin = constants_1.POOL_ADMIN[networkId];
    const desiredEmergencyAdmin = constants_1.EMERGENCY_ADMIN[networkId];
    if (!desiredAdmin) {
        console.error("The constant desired Multisig is undefined. Check missing admin address at MULTISIG_ADDRESS or GOVERNANCE_BRIDGE_EXECUTOR constant");
        (0, process_1.exit)(403);
    }
    if (!desiredEmergencyAdmin) {
        console.error("The constant desired EmergencyAdmin is undefined. Check missing Multisig at MULTISIG_ADDRESS constant");
        (0, process_1.exit)(403);
    }
    const poolAddressesProvider = await (0, contract_getters_2.getPoolAddressesProvider)();
    const rewardsController = await (0, contract_getters_1.getIncentivesV2)();
    const emissionManager = await (0, contract_getters_1.getEmissionManager)();
    console.log("--- Current deployer addresses ---");
    console.table({
        poolAdmin,
    });
    console.log("--- Multisig and expected contract addresses ---");
    console.table({
        multisig: desiredAdmin,
        poolAddressesProvider: poolAddressesProvider.address,
        rewardsProxy: rewardsController.address,
    });
    const currentOwner = await poolAddressesProvider.owner();
    if (currentOwner !== poolAdmin) {
        console.log("- Accounts loaded doesn't match current Market owner", currentOwner);
        console.log(`  - Market owner loaded from account  :`, poolAdmin);
        console.log(`  - Market owner loaded from pool prov:`, currentOwner);
    }
    // The Rewards Controller must be set at PoolAddressesProvider with id keccak256("INCENTIVES_CONTROLLER"):
    // 0x703c2c8634bed68d98c029c18f310e7f7ec0e5d6342c590190b3cb8b3ba54532
    const incentivesControllerId = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("INCENTIVES_CONTROLLER"));
    const poolAddressesProviderRegistry = await (0, contract_getters_2.getPoolAddressesProviderRegistry)();
    const aclManager = (await (0, contract_getters_2.getACLManager)(await poolAddressesProvider.getACLManager())).connect(aclSigner);
    const treasuryProxy = (await hre.ethers.getContractAt("InitializableAdminUpgradeabilityProxy", (await hre.deployments.get(deploy_ids_1.TREASURY_PROXY_ID)).address, deployerSigner));
    const treasuryController = (await hre.ethers.getContractAt("AaveEcosystemReserveController", (await hre.deployments.get(deploy_ids_1.TREASURY_CONTROLLER_ID)).address, deployerSigner));
    let wrappedTokenGateway;
    try {
        wrappedTokenGateway = await (0, contract_getters_2.getWrappedTokenGateway)();
    }
    catch (err) {
        // load legacy contract of WrappedTokenGateway
        wrappedTokenGateway = WrappedTokenGatewayV3__factory_1.WrappedTokenGatewayV3__factory.connect(await (0, tx_1.getAddressFromJson)(networkId, "WETHGateway"), await (0, signer_1.getFirstSigner)());
    }
    const paraswapSwapAdapter = await (0, contract_getters_1.getOwnableContract)(await (await hre.deployments.get("ParaSwapLiquiditySwapAdapter")).address);
    const paraswapRepayAdapter = await (0, contract_getters_1.getOwnableContract)(await (await hre.deployments.get("ParaSwapRepayAdapter")).address);
    /** Output of results*/
    const result = [
        {
            role: "PoolAddressesProvider owner",
            address: await poolAddressesProvider.owner(),
            assert: (await poolAddressesProvider.owner()) === desiredAdmin,
        },
        {
            role: "PoolAddressesProviderRegistry owner",
            address: await poolAddressesProviderRegistry.owner(),
            assert: (await poolAddressesProviderRegistry.owner()) === desiredAdmin,
        },
        {
            role: "AddressesProvider ACL Admin",
            address: await poolAddressesProvider.getACLAdmin(),
            assert: (await poolAddressesProvider.getACLAdmin()) === desiredAdmin,
        },
        {
            role: "ACL Manager Default Admin role granted Multisig",
            address: (await aclManager.hasRole(hre.ethers.constants.HashZero, desiredAdmin))
                ? desiredAdmin
                : (await aclManager.hasRole(hre.ethers.constants.HashZero, deployer))
                    ? deployer
                    : "UNKNOWN",
            assert: await aclManager.hasRole(hre.ethers.constants.HashZero, desiredAdmin),
        },
        {
            role: "ACL Manager  Default Admin role revoked Deployer",
            address: (await aclManager.hasRole(hre.ethers.constants.HashZero, deployer))
                ? "NOT REVOKED"
                : "REVOKED",
            assert: !(await aclManager.hasRole(hre.ethers.constants.HashZero, deployer)),
        },
        {
            role: "WrappedTokenGateway owner",
            address: await wrappedTokenGateway.owner(),
            assert: (await wrappedTokenGateway.owner()) === desiredAdmin,
        },
        {
            role: "PoolAdmin is multisig",
            address: (await aclManager.isPoolAdmin(desiredAdmin))
                ? desiredAdmin
                : constants_1.ZERO_ADDRESS,
            assert: await aclManager.isPoolAdmin(desiredAdmin),
        },
        {
            role: "Deployer revoked PoolAdmin",
            address: (await aclManager.isPoolAdmin(deployer))
                ? "NOT REVOKED"
                : "REVOKED",
            assert: !(await aclManager.isPoolAdmin(deployer)),
        },
        {
            role: "EmergencyAdmin",
            address: (await aclManager.isEmergencyAdmin(desiredEmergencyAdmin))
                ? desiredEmergencyAdmin
                : emergencyAdmin,
            assert: await aclManager.isEmergencyAdmin(desiredEmergencyAdmin),
        },
        {
            role: "AssetListAdmin",
            address: (await aclManager.isAssetListingAdmin(poolAdmin))
                ? poolAdmin
                : "DISABLED",
            assert: (await aclManager.isAssetListingAdmin(poolAdmin)) === false,
        },
        {
            role: "EmissionManager controller contract Owner",
            address: emissionManager
                ? await emissionManager.owner()
                : "Missing contract address",
            assert: emissionManager
                ? (await emissionManager.owner()) === desiredAdmin
                : false,
        },
        {
            role: "Treasury Proxy Admin",
            address: await (0, tx_2.getProxyAdminBySlot)(treasuryProxy.address),
            assert: (await (0, tx_2.getProxyAdminBySlot)(treasuryProxy.address)) === desiredAdmin,
        },
        {
            role: "Treasury Controller owner",
            address: await treasuryController.owner(),
            assert: (await treasuryController.owner()) === desiredAdmin,
        },
        {
            role: "PoolAddressesProvider.getAddress INCENTIVES_CONTROLLER",
            address: await poolAddressesProvider.getAddress(incentivesControllerId),
            assert: (await poolAddressesProvider.getAddress(incentivesControllerId)) ===
                rewardsController.address,
        },
        {
            role: "ParaSwapRepayAdapter owner",
            address: await paraswapRepayAdapter.owner(),
            assert: (await paraswapRepayAdapter.owner()) == desiredAdmin,
        },
        {
            role: "ParaSwapSwapAdapter owner",
            address: await paraswapSwapAdapter.owner(),
            assert: (await paraswapSwapAdapter.owner()) == desiredAdmin,
        },
    ];
    // Add emission manager check if 3.0.1v
    try {
        const emissionManagerAddress = await rewardsController.EMISSION_MANAGER();
        result.push({
            role: "Emission manager role at Rewards Controller",
            address: emissionManagerAddress,
            assert: emissionManagerAddress === emissionManager.address,
        });
    }
    catch (err) { }
    console.table(result);
    return;
});
