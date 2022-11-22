import { FORK } from "../../helpers/hardhat-config-helpers";
import { ZERO_ADDRESS } from "../../helpers/constants";
import {
  POOL_ADDRESSES_PROVIDER_ID,
  INCENTIVES_PROXY_ID,
} from "../../helpers/deploy-ids";
import { InitializableAdminUpgradeabilityProxy } from "../../typechain/InitializableAdminUpgradeabilityProxy";
import { getPoolAddressesProvider } from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import {
  getAddressFromJson,
  getProxyAdminBySlot,
  waitForTx,
} from "../../helpers/utilities/tx";
import { exit } from "process";

task(
  `set-rewards-at-provider`,
  `Set rewards controller proxy address at PoolAddressesProvider`
).setAction(async (_, hre) => {
  // Deployer admins
  const { poolAdmin, deployer, incentivesProxyAdmin } =
    await hre.getNamedAccounts();

  const deployerSigner = await hre.ethers.getSigner(deployer);
  const rewardsSigner = await hre.ethers.getSigner(incentivesProxyAdmin);
  const networkId = FORK ? FORK : hre.network.name;

  console.log("--- CURRENT DEPLOYER ADDRESSES ---");
  console.table({
    poolAdmin,
  });

  const poolAddressesProvider = await getPoolAddressesProvider(
    await getAddressFromJson(networkId, POOL_ADDRESSES_PROVIDER_ID)
  );

  const currentOwner = await poolAddressesProvider.owner();

  if (currentOwner !== poolAdmin) {
    console.log(
      "- Accounts loaded doesnt match current Market owner",
      currentOwner
    );
    console.log(`  - Market owner loaded from account  :`, poolAdmin);
    console.log(`  - Market owner loaded from pool prov:`, currentOwner);
    exit(403);
  }

  // The Rewards Controller must be set at PoolAddressesProvider with id keccak256("INCENTIVES_CONTROLLER"):
  // 0x703c2c8634bed68d98c029c18f310e7f7ec0e5d6342c590190b3cb8b3ba54532
  const incentivesControllerId = hre.ethers.utils.keccak256(
    hre.ethers.utils.toUtf8Bytes("INCENTIVES_CONTROLLER")
  );

  const rewardsController = await hre.ethers.getContractAt(
    "RewardsController",
    await getAddressFromJson(networkId, INCENTIVES_PROXY_ID),
    deployerSigner
  );
  const rewardsProxy =
    await hre.ethers.getContractAt<InitializableAdminUpgradeabilityProxy>(
      "InitializableAdminUpgradeabilityProxy",
      rewardsController.address,
      deployerSigner
    );

  /** Start of RewardsController transfer proxy ownership */
  const isDeployerAdminOfRewardsProxy =
    (await getProxyAdminBySlot(rewardsProxy.address)) === incentivesProxyAdmin;
  if (isDeployerAdminOfRewardsProxy) {
    await waitForTx(
      await rewardsProxy
        .connect(rewardsSigner)
        .changeAdmin(poolAddressesProvider.address)
    );
    console.log("- Transferred RewardsController Proxy admin");
  }

  const isIncentivesMissingAtPoolAddressesProvider =
    (await poolAddressesProvider.getAddress(incentivesControllerId)) ===
    ZERO_ADDRESS;
  if (isIncentivesMissingAtPoolAddressesProvider) {
    await waitForTx(
      await poolAddressesProvider.setAddress(
        incentivesControllerId,
        rewardsProxy.address
      )
    );
    console.log(
      "- Updated pool addresses provider to add RewardsController proxy"
    );
  }

  /** End of RewardsController transfer proxy ownership */

  /** Output of results*/
  const result = [
    {
      role: "RewardsProxyAdmin",
      address: await getProxyAdminBySlot(rewardsProxy.address),
      assert:
        (await getProxyAdminBySlot(rewardsProxy.address)) ===
        poolAddressesProvider.address,
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
