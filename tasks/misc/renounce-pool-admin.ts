import { POOL_ADMIN } from "./../../helpers/constants";
import { FORK } from "../../helpers/hardhat-config-helpers";
import { POOL_ADDRESSES_PROVIDER_ID } from "../../helpers/deploy-ids";
import {
  getACLManager,
  getPoolAddressesProvider,
} from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import { getAddressFromJson, waitForTx } from "../../helpers/utilities/tx";
import { exit } from "process";

task(
  `renounce-pool-admin`,
  `Renounce PoolAdmin role as deployer if `
).setAction(async (_, hre) => {
  const { deployer } = await hre.getNamedAccounts();

  const deployerSigner = await hre.ethers.getSigner(deployer);

  const networkId = FORK ? FORK : hre.network.name;
  const desiredAdmin = POOL_ADMIN[networkId];
  if (!desiredAdmin) {
    console.error(
      "The constant desired admin is undefined. Check missing admin address at MULTISIG_ADDRESS or GOVERNANCE_BRIDGE_EXECUTOR constant"
    );
    exit(403);
  }

  console.log("--- CURRENT DEPLOYER  ---");
  console.table({
    deployer,
  });
  console.log("--- DESIRED  ADMIN ---");
  console.log(desiredAdmin);

  const poolAddressesProvider = await getPoolAddressesProvider();

  const aclManager = (
    await getACLManager(await poolAddressesProvider.getACLManager())
  ).connect(deployerSigner);

  /** Start of Pool Listing Admin transfer ownership */
  const isDeployerPoolAdmin = await aclManager.isPoolAdmin(deployer);
  const isMultisigPoolAdmin = await aclManager.isPoolAdmin(desiredAdmin);
  if (isDeployerPoolAdmin && isMultisigPoolAdmin) {
    const tx = await waitForTx(
      await aclManager.renounceRole(
        await aclManager.POOL_ADMIN_ROLE(),
        deployer
      )
    );
    console.log("- Deployer renounced PoolAdmin role");
    console.log("- TX:", tx.transactionHash);
  } else if (!isDeployerPoolAdmin && isMultisigPoolAdmin) {
    console.log(
      "- The deployer already renounced the Pool Admin role before running this script"
    );
  } else if (isDeployerPoolAdmin && !isMultisigPoolAdmin) {
    console.log(
      "- The multisig or guardian must be PoolAdmin before Deployer resigns"
    );
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
