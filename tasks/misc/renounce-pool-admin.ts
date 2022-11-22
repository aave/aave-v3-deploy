import { FORK } from "../../helpers/hardhat-config-helpers";
import { POOL_ADDRESSES_PROVIDER_ID } from "../../helpers/deploy-ids";
import {
  getACLManager,
  getPoolAddressesProvider,
} from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import { getAddressFromJson, waitForTx } from "../../helpers/utilities/tx";
import { exit } from "process";
import {
  MULTISIG_ADDRESS,
  GOVERNANCE_BRIDGE_EXECUTOR,
} from "../../helpers/constants";

task(
  `renounce-pool-admin`,
  `Renounce PoolAdmin role as deployer if `
).setAction(async (_, hre) => {
  const { deployer } = await hre.getNamedAccounts();

  const deployerSigner = await hre.ethers.getSigner(deployer);

  const networkId = FORK ? FORK : hre.network.name;
  // Desired Admin at Polygon must be the bridge crosschain executor, not the multisig
  const desiredMultisig = networkId.includes("polygon")
    ? GOVERNANCE_BRIDGE_EXECUTOR[networkId]
    : MULTISIG_ADDRESS[networkId];
  if (!desiredMultisig) {
    console.error(
      "The constant desired Multisig is undefined. Check missing admin address at MULTISIG_ADDRESS or GOVERNANCE_BRIDGE_EXECUTOR constant"
    );
    exit(403);
  }

  console.log("--- CURRENT DEPLOYER  ---");
  console.table({
    deployer,
  });
  console.log("--- DESIRED MULTISIG ADMIN ---");
  console.log(desiredMultisig);

  const poolAddressesProvider = await getPoolAddressesProvider(
    await getAddressFromJson(networkId, POOL_ADDRESSES_PROVIDER_ID)
  );

  const aclManager = (
    await getACLManager(await poolAddressesProvider.getACLManager())
  ).connect(deployerSigner);

  /** Start of Pool Listing Admin transfer ownership */
  const isDeployerPoolAdmin = await aclManager.isPoolAdmin(deployer);
  const isMultisigPoolAdmin = await aclManager.isPoolAdmin(desiredMultisig);
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
      role: "Multisig is still PoolAdmin",
      address: (await aclManager.isPoolAdmin(desiredMultisig)) ? "YES" : "NO",
      assert: await aclManager.isPoolAdmin(desiredMultisig),
    },
  ];

  console.table(result);

  return;
});
