import { POOL_ADMIN } from "./../../helpers/constants";
import { FORK } from "./../../helpers/hardhat-config-helpers";
import {
  EMISSION_MANAGER_ID,
  POOL_ADDRESSES_PROVIDER_ID,
} from "./../../helpers/deploy-ids";
import {
  getACLManager,
  getEmissionManager,
  getOwnableContract,
  getPoolAddressesProvider,
  getPoolAddressesProviderRegistry,
  getWrappedTokenGateway,
} from "./../../helpers/contract-getters";
import { task } from "hardhat/config";
import { getAddressFromJson, waitForTx } from "../../helpers/utilities/tx";
import { exit } from "process";
import {
  GOVERNANCE_BRIDGE_EXECUTOR,
  MULTISIG_ADDRESS,
} from "../../helpers/constants";

task(
  `transfer-protocol-ownership`,
  `Transfer the ownership of protocol from deployer`
).setAction(async (_, hre) => {
  // Deployer admins
  const {
    poolAdmin,
    aclAdmin,
    deployer,
    emergencyAdmin,
    incentivesEmissionManager,
    treasuryProxyAdmin,
    addressesProviderRegistryOwner,
  } = await hre.getNamedAccounts();

  const networkId = FORK ? FORK : hre.network.name;
  // Desired Admin at Polygon must be the bridge crosschain executor, not the multisig
  const desiredAdmin = POOL_ADMIN[networkId];
  if (!desiredAdmin) {
    console.error(
      "The constant desired Multisig is undefined. Check missing admin address at MULTISIG_ADDRESS or GOVERNANCE_BRIDGE_EXECUTOR constant"
    );
    exit(403);
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

  const poolAddressesProvider = await getPoolAddressesProvider();
  const poolAddressesProviderRegistry =
    await getPoolAddressesProviderRegistry();

  const wrappedGateway = await getWrappedTokenGateway();

  const aclManager = (
    await getACLManager(await poolAddressesProvider.getACLManager())
  ).connect(aclSigner);

  const emissionManager = await getEmissionManager();
  const currentOwner = await poolAddressesProvider.owner();
  const paraswapSwapAdapter = await getOwnableContract(
    await (
      await hre.deployments.get("ParaSwapLiquiditySwapAdapter")
    ).address
  );
  const paraswapRepayAdapter = await getOwnableContract(
    await (
      await hre.deployments.get("ParaSwapRepayAdapter")
    ).address
  );
  const paraswapWithdrawSwapAdapter = await getOwnableContract(
    await (
      await hre.deployments.get("ParaSwapWithdrawSwapAdapter")
    ).address
  );

  if (currentOwner === desiredAdmin) {
    console.log(
      "- This market already transferred the ownership to desired multisig"
    );
    exit(0);
  }
  if (currentOwner !== poolAdmin) {
    console.log(
      "- Accounts loaded doesn't match current Market owner",
      currentOwner
    );
    console.log(`  - Market owner loaded from account  :`, poolAdmin);
    console.log(`  - Market owner loaded from pool prov:`, currentOwner);
    exit(403);
  }

  /** Start of Paraswap Helpers Ownership */
  const isDeployerAdminParaswapRepayAdapter =
    (await paraswapRepayAdapter.owner()) == deployer;

  if (isDeployerAdminParaswapRepayAdapter) {
    await paraswapRepayAdapter.transferOwnership(desiredAdmin);
    console.log("- Transferred ParaswapRepayAdapter ownership");
  }

  const isDeployerAdminParaswapSwapAdapter =
    (await paraswapSwapAdapter.owner()) == deployer;

  if (isDeployerAdminParaswapSwapAdapter) {
    await paraswapSwapAdapter.transferOwnership(desiredAdmin);
    console.log("- Transferred ParaswapSwapAdapter ownership");
  }

  const isDeployerAdminParaswapWithdrawSwapAdapter =
    (await paraswapWithdrawSwapAdapter.owner()) == deployer;

  if (isDeployerAdminParaswapWithdrawSwapAdapter) {
    await paraswapWithdrawSwapAdapter.transferOwnership(desiredAdmin);
    console.log("- Transferred ParaswapWithdrawSwapAdapter ownership");
  }
  /** End of Paraswap Helpers Ownership */

  /** Start of Emergency Admin transfer */
  const isDeployerEmergencyAdmin = await aclManager.isEmergencyAdmin(
    emergencyAdmin
  );
  if (isDeployerEmergencyAdmin) {
    await waitForTx(await aclManager.addEmergencyAdmin(desiredAdmin));

    await waitForTx(await aclManager.removeEmergencyAdmin(emergencyAdmin));
    console.log("- Transferred the ownership of Emergency Admin");
  }
  /** End of Emergency Admin transfer */

  /** Start of Pool Admin transfer */
  const isDeployerPoolAdmin = await aclManager.isPoolAdmin(poolAdmin);
  if (isDeployerPoolAdmin) {
    await waitForTx(await aclManager.addPoolAdmin(desiredAdmin));

    await waitForTx(await aclManager.removePoolAdmin(poolAdmin));
    console.log("- Transferred the ownership of Pool Admin");
  }
  /** End of Pool Admin transfer */

  /** Start of Pool Addresses Provider  Registry transfer ownership */
  const isDeployerACLAdminAtPoolAddressesProviderOwner =
    (await poolAddressesProvider.getACLAdmin()) === deployer;
  if (isDeployerACLAdminAtPoolAddressesProviderOwner) {
    await poolAddressesProvider.setACLAdmin(desiredAdmin);
    console.log("- Transferred ACL Admin");
  }

  /** Start of Pool Addresses Provider transfer ownership */
  const isDeployerPoolAddressesProviderOwner =
    (await poolAddressesProvider.owner()) === poolAdmin;
  if (isDeployerPoolAddressesProviderOwner) {
    await poolAddressesProvider.transferOwnership(desiredAdmin);
    console.log(
      "- Transferred of Pool Addresses Provider and Market ownership"
    );
  }
  /** End of Pool Addresses Provider transfer ownership */

  /** Start of Pool Addresses Provider  Registry transfer ownership */
  const isDeployerPoolAddressesProviderRegistryOwner =
    (await poolAddressesProviderRegistry.owner()) ===
    addressesProviderRegistryOwner;
  if (isDeployerPoolAddressesProviderRegistryOwner) {
    await poolAddressesProviderRegistry.transferOwnership(desiredAdmin);
    console.log("- Transferred of Pool Addresses Provider Registry");
  }
  /** End of Pool Addresses Provider Registry transfer ownership */

  /** Start of WrappedTokenGateway transfer ownership */
  const isDeployerGatewayOwner = (await wrappedGateway.owner()) === poolAdmin;
  if (isDeployerGatewayOwner) {
    await waitForTx(await wrappedGateway.transferOwnership(desiredAdmin));
    console.log("- Transferred WrappedTokenGateway ownership");
  }
  /** End of WrappedTokenGateway ownership */

  /** Start of EmissionManager transfer ownership */
  const isDeployerEmissionManagerOwner =
    (await emissionManager.owner()) === deployer;
  if (isDeployerEmissionManagerOwner) {
    await emissionManager.transferOwnership(desiredAdmin);
    console.log(`
    - Transferred owner of EmissionManager from ${deployer} to ${desiredAdmin}
    `);
  }
  /** End of EmissionManager transfer ownership */

  /** Start of DEFAULT_ADMIN_ROLE transfer ownership */
  const isDeployerDefaultAdmin = await aclManager.hasRole(
    hre.ethers.constants.HashZero,
    deployer
  );
  if (isDeployerDefaultAdmin) {
    console.log(
      "- Transferring the DEFAULT_ADMIN_ROLE to the multisig address"
    );
    await waitForTx(
      await aclManager.grantRole(hre.ethers.constants.HashZero, desiredAdmin)
    );
    console.log(
      "- Revoking deployer as DEFAULT_ADMIN_ROLE to the multisig address"
    );
    await waitForTx(
      await aclManager.revokeRole(hre.ethers.constants.HashZero, deployer)
    );
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
      role: "ACL Default Admin role granted Multisig",
      address: (await aclManager.hasRole(
        hre.ethers.constants.HashZero,
        desiredAdmin
      ))
        ? desiredAdmin
        : (await aclManager.hasRole(hre.ethers.constants.HashZero, deployer))
        ? deployer
        : "UNKNOWN",
      assert: await aclManager.hasRole(
        hre.ethers.constants.HashZero,
        desiredAdmin
      ),
    },
  ];

  console.table(result);

  return;
});
