import { FORK } from "./../../helpers/hardhat-config-helpers";
import {
  EMISSION_MANAGER_ID,
  POOL_ADDRESSES_PROVIDER_ID,
} from "./../../helpers/deploy-ids";
import {
  getACLManager,
  getEmissionManager,
  getPoolAddressesProvider,
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
    incentivesProxyAdmin,
    incentivesEmissionManager,
    treasuryProxyAdmin,
  } = await hre.getNamedAccounts();

  const networkId = FORK ? FORK : hre.network.name;
  // Desired Admin at Polygon must be the bridge crosschain executor, not the multisig
  const desiredMultisig = networkId.includes("polygon")
    ? GOVERNANCE_BRIDGE_EXECUTOR[networkId]
    : MULTISIG_ADDRESS[networkId];
  // Desired Emergency Admin at Polygon must be the multisig, not the crosschain executor
  if (!desiredMultisig) {
    console.error(
      "The constant desired Multisig is undefined. Check missing admin address at MULTISIG_ADDRESS or GOVERNANCE_BRIDGE_EXECUTOR constant"
    );
    exit(403);
  }

  console.log("--- CURRENT DEPLOYER ADDRESSES ---");
  console.table({
    poolAdmin,
    incentivesProxyAdmin,
    incentivesEmissionManager,
    treasuryProxyAdmin,
  });
  console.log("--- DESIRED MULTISIG ADMIN ---");
  console.log(desiredMultisig);
  const aclSigner = await hre.ethers.getSigner(aclAdmin);

  const poolAddressesProvider = await getPoolAddressesProvider(
    await getAddressFromJson(networkId, POOL_ADDRESSES_PROVIDER_ID)
  );

  const aclManager = (
    await getACLManager(await poolAddressesProvider.getACLManager())
  ).connect(aclSigner);

  const emissionManager = await getEmissionManager(
    await getAddressFromJson(networkId, EMISSION_MANAGER_ID)
  );
  const currentOwner = await poolAddressesProvider.owner();

  if (currentOwner === desiredMultisig) {
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

  const isDeployerPoolAdmin = await aclManager.isPoolAdmin(poolAdmin);
  if (isDeployerPoolAdmin) {
    await waitForTx(await aclManager.addPoolAdmin(desiredMultisig));

    await waitForTx(await aclManager.removePoolAdmin(poolAdmin));
    console.log("- Transferred the ownership of Pool Admin");
  }

  /** Start of Pool Addresses Provider transfer ownership */
  const isDeployerPoolAddressesProviderOwner =
    (await poolAddressesProvider.owner()) === poolAdmin;
  if (isDeployerPoolAddressesProviderOwner) {
    await poolAddressesProvider.transferOwnership(desiredMultisig);
    console.log(
      "- Transferred of Pool Addresses Provider and Market ownership"
    );
  }
  /** End of Pool Addresses Provider transfer ownership */

  /** Start of EmissionManager transfer ownership */
  const isDeployerEmissionManagerOwner =
    (await emissionManager.owner()) === deployer;
  if (isDeployerEmissionManagerOwner) {
    await emissionManager.transferOwnership(desiredMultisig);
    console.log(`
    - Transferred owner of EmissionManager from ${deployer} to ${desiredMultisig}
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
      await aclManager.grantRole(hre.ethers.constants.HashZero, desiredMultisig)
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
      address: (await aclManager.isPoolAdmin(desiredMultisig))
        ? desiredMultisig
        : poolAdmin,
      assert: await aclManager.isPoolAdmin(desiredMultisig),
    },
    {
      role: "PoolAddressesProvider owner",
      address: await poolAddressesProvider.owner(),
      assert: (await poolAddressesProvider.owner()) === desiredMultisig,
    },
    {
      role: "EmissionManager owner",
      address: await emissionManager.owner(),
      assert: (await emissionManager.owner()) === desiredMultisig,
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
  ];

  console.table(result);

  return;
});
