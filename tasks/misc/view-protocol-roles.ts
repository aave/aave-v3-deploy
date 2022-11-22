import { ZERO_ADDRESS } from "./../../helpers/constants";
import { EmissionManager } from "./../../typechain";
import { getEmissionManager } from "./../../helpers/contract-getters";
import { EMISSION_MANAGER_ID } from "./../../helpers/deploy-ids";
import { FORK } from "../../helpers/hardhat-config-helpers";
import {
  TREASURY_PROXY_ID,
  TREASURY_CONTROLLER_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  INCENTIVES_PROXY_ID,
} from "../../helpers/deploy-ids";
import { InitializableAdminUpgradeabilityProxy } from "../../typechain";
import {
  getACLManager,
  getPoolAddressesProvider,
  getPoolAddressesProviderRegistry,
  getWrappedTokenGateway,
} from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import {
  getAddressFromJson,
  getProxyAdminBySlot,
} from "../../helpers/utilities/tx";
import { exit } from "process";
import {
  GOVERNANCE_BRIDGE_EXECUTOR,
  MULTISIG_ADDRESS,
} from "../../helpers/constants";

task(
  `view-protocol-roles`,
  `View current admin of each role and contract`
).setAction(async (_, hre) => {
  // Deployer admins
  const {
    poolAdmin,
    aclAdmin,
    emergencyAdmin,
    deployer,
    incentivesProxyAdmin,
    incentivesEmissionManager,
    treasuryProxyAdmin,
  } = await hre.getNamedAccounts();

  const deployerSigner = await hre.ethers.getSigner(deployer);
  const aclSigner = await hre.ethers.getSigner(aclAdmin);
  const networkId = FORK ? FORK : hre.network.name;
  // Desired Admin at Polygon must be the bridge crosschain executor, not the multisig
  const desiredMultisig = networkId.includes("polygon")
    ? GOVERNANCE_BRIDGE_EXECUTOR[networkId]
    : MULTISIG_ADDRESS[networkId];
  // Desired Emergency Admin at Polygon must be the multisig, not the crosschain executor
  const desiredEmergencyAdmin = networkId.includes("polygon")
    ? MULTISIG_ADDRESS[networkId]
    : desiredMultisig;
  if (!desiredMultisig) {
    console.error(
      "The constant desired Multisig is undefined. Check missing admin address at MULTISIG_ADDRESS or GOVERNANCE_BRIDGE_EXECUTOR constant"
    );
    exit(403);
  }

  if (!desiredEmergencyAdmin) {
    console.error(
      "The constant desired EmergencyAdmin is undefined. Check missing Multisig at MULTISIG_ADDRESS constant"
    );
    exit(403);
  }
  const poolAddressesProvider = await getPoolAddressesProvider(
    await getAddressFromJson(networkId, POOL_ADDRESSES_PROVIDER_ID)
  );
  const rewardsController = await hre.ethers.getContractAt(
    "RewardsController",
    await getAddressFromJson(networkId, INCENTIVES_PROXY_ID),
    deployerSigner
  );
  let emissionManagerAddress;
  let emissionManager: EmissionManager | undefined;
  try {
    emissionManagerAddress = await getAddressFromJson(
      networkId,
      EMISSION_MANAGER_ID
    );
  } catch {
    console.log("Missing EmissionManager artifact.");
  }
  if (emissionManagerAddress) {
    emissionManager = await getEmissionManager(emissionManagerAddress);
  }

  console.log("--- Current deployer addresses ---");
  console.table({
    poolAdmin,
    incentivesProxyAdmin,
    incentivesEmissionManager,
    treasuryProxyAdmin,
  });
  console.log("--- Multisig and expected contract addresses ---");
  console.table({
    multisig: desiredMultisig,
    poolAddressesProvider: poolAddressesProvider.address,
    rewardsProxy: rewardsController.address,
  });

  const currentOwner = await poolAddressesProvider.owner();

  if (currentOwner !== poolAdmin) {
    console.log(
      "- Accounts loaded doesn't match current Market owner",
      currentOwner
    );
    console.log(`  - Market owner loaded from account  :`, poolAdmin);
    console.log(`  - Market owner loaded from pool prov:`, currentOwner);
  }

  // The Rewards Controller must be set at PoolAddressesProvider with id keccak256("INCENTIVES_CONTROLLER"):
  // 0x703c2c8634bed68d98c029c18f310e7f7ec0e5d6342c590190b3cb8b3ba54532
  const incentivesControllerId = hre.ethers.utils.keccak256(
    hre.ethers.utils.toUtf8Bytes("INCENTIVES_CONTROLLER")
  );

  const poolAddressesProviderRegistry = await getPoolAddressesProviderRegistry(
    await getAddressFromJson(networkId, "PoolAddressesProviderRegistry")
  );
  const aclManager = (
    await getACLManager(await poolAddressesProvider.getACLManager())
  ).connect(aclSigner);
  const treasuryProxy =
    await hre.ethers.getContractAt<InitializableAdminUpgradeabilityProxy>(
      "InitializableAdminUpgradeabilityProxy",
      await getAddressFromJson(networkId, TREASURY_PROXY_ID),
      deployerSigner
    );
  const treasuryController =
    await hre.ethers.getContractAt<AaveEcosystemReserveController>(
      "AaveEcosystemReserveController",
      await getAddressFromJson(networkId, TREASURY_CONTROLLER_ID),
      deployerSigner
    );
  const wrappedTokenGateway = await getWrappedTokenGateway(
    await getAddressFromJson(networkId, "WrappedTokenGatewayV3")
  );

  const rewardsProxy =
    await hre.ethers.getContractAt<InitializableAdminUpgradeabilityProxy>(
      "InitializableAdminUpgradeabilityProxy",
      rewardsController.address,
      deployerSigner
    );

  /** Output of results*/
  const result = [
    {
      role: "PoolAddressesProvider owner",
      address: await poolAddressesProvider.owner(),
      assert: (await poolAddressesProvider.owner()) === desiredMultisig,
    },
    {
      role: "PoolAddressesProviderRegistry owner",
      address: await poolAddressesProviderRegistry.owner(),
      assert: (await poolAddressesProviderRegistry.owner()) === desiredMultisig,
    },
    {
      role: "AddressesProvider ACL Admin",
      address: await poolAddressesProvider.getACLAdmin(),
      assert: (await poolAddressesProvider.getACLAdmin()) === desiredMultisig,
    },
    {
      role: "ACL Manager Default Admin role granted Multisig",
      address: (await aclManager.hasRole(
        hre.ethers.constants.HashZero,
        desiredMultisig
      ))
        ? desiredMultisig
        : (await aclManager.hasRole(hre.ethers.constants.HashZero, deployer))
        ? deployer
        : "UNKNOWN",
      assert: await aclManager.hasRole(
        hre.ethers.constants.HashZero,
        desiredMultisig
      ),
    },
    {
      role: "ACL Manager  Default Admin role revoked Deployer",
      address: (await aclManager.hasRole(
        hre.ethers.constants.HashZero,
        deployer
      ))
        ? "NOT REVOKED"
        : "REVOKED",
      assert: !(await aclManager.hasRole(
        hre.ethers.constants.HashZero,
        deployer
      )),
    },
    {
      role: "WrappedTokenGateway owner",
      address: await wrappedTokenGateway.owner(),
      assert: (await wrappedTokenGateway.owner()) === desiredMultisig,
    },
    {
      role: "PoolAdmin is multisig",
      address: (await aclManager.isPoolAdmin(desiredMultisig))
        ? desiredMultisig
        : ZERO_ADDRESS,
      assert: await aclManager.isPoolAdmin(desiredMultisig),
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
      role: "RewardsController Proxy Owner",
      address: await getProxyAdminBySlot(rewardsProxy.address),
      assert:
        (await getProxyAdminBySlot(rewardsProxy.address)) ===
        poolAddressesProvider.address,
    },
    {
      role: "Emission manager role at Rewards Controller",
      address: await rewardsController.getEmissionManager(),
      assert:
        (await rewardsController.getEmissionManager()) ===
        emissionManagerAddress,
    },
    {
      role: "EmissionManager controller contract Owner",
      address: emissionManager
        ? await emissionManager.owner()
        : "Missing contract address",
      assert: emissionManager
        ? (await emissionManager.owner()) === desiredMultisig
        : false,
    },
    {
      role: "Treasury Proxy Admin",
      address: await getProxyAdminBySlot(treasuryProxy.address),
      assert:
        (await getProxyAdminBySlot(treasuryProxy.address)) === desiredMultisig,
    },
    {
      role: "Treasury Controller owner",
      address: await treasuryController.owner(),
      assert: (await treasuryController.owner()) === desiredMultisig,
    },
    {
      role: "PoolAddressesProvider.getAddress INCENTIVES_CONTROLLER",
      address: await poolAddressesProvider.getAddress(incentivesControllerId),
      assert:
        (await poolAddressesProvider.getAddress(incentivesControllerId)) ===
        rewardsController.address,
    },
  ];

  console.table(result);

  return;
});
