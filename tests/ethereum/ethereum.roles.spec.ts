import { expect } from "chai";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
  ConfigNames,
  ETHEREUM_SHORT_EXECUTOR,
  getACLManager,
  getPoolAddressesProvider,
  getPoolAddressesProviderRegistry,
  getWrappedTokenGateway,
  ICommonConfiguration,
  loadPoolConfig,
  PoolAddressesProvider,
} from "../../helpers";
import { getOwnableContract } from "../../helpers/contract-getters";
import { TREASURY_CONTROLLER_ID } from "../../helpers/deploy-ids";
import { getFirstSigner } from "../../helpers/utilities/signer";
import { AaveEcosystemReserveController__factory } from "../../typechain/factories/@aave/periphery-v3/contracts/treasury/AaveEcosystemReserveController__factory";
import {
  getEmissionManager,
  getIncentivesV2,
} from "./../../helpers/contract-getters";

// Prevent error HH9 when importing this file inside tasks or helpers at Hardhat config load
declare var hre: HardhatRuntimeEnvironment;

describe("Ethereum V3 - Token-less deployment", function () {
  let addressesProvider: PoolAddressesProvider;
  let poolConfig: ICommonConfiguration;
  before(async () => {
    expect(process.env.MARKET_NAME).equal("Ethereum");

    await hre.deployments.fixture(["market", "periphery-post", "after-deploy"]);

    addressesProvider = await getPoolAddressesProvider();
    poolConfig = loadPoolConfig((process.env.MARKET_NAME || "") as ConfigNames);
  });

  describe("Roles", () => {
    it("PoolAddressesProviderRegistry Owner should be short executor", async () => {
      const registry = await getPoolAddressesProviderRegistry();
      expect(await registry.owner()).equals(ETHEREUM_SHORT_EXECUTOR);
    });
    it("PoolAddressesProvider Owner should be short executor", async () => {
      expect(await addressesProvider.owner()).equals(ETHEREUM_SHORT_EXECUTOR);
    });
    it("ACLManager admin should be short executor", async () => {
      const acl = await getACLManager();
      const DefaultAdminRole = await acl.DEFAULT_ADMIN_ROLE();
      await expect(
        await acl.hasRole(DefaultAdminRole, ETHEREUM_SHORT_EXECUTOR)
      );
    });
    it("Pool admin should be short executor", async () => {
      const acl = await getACLManager();
      await expect(await acl.isPoolAdmin(ETHEREUM_SHORT_EXECUTOR)).to.be.true;
    });
    it("Emergency admin should be short executor", async () => {
      const acl = await getACLManager();
      await expect(await acl.isEmergencyAdmin(ETHEREUM_SHORT_EXECUTOR)).to.be
        .true;
    });
    it("PoolAddressesProvider ACLAdmin should be short executor", async () => {
      await expect(await addressesProvider.getACLAdmin()).equal(
        ETHEREUM_SHORT_EXECUTOR
      );
    });
    it("WrappedCoinGateway admin should be short executor", async () => {
      const wethgateway = await getWrappedTokenGateway();
      await expect(await wethgateway.owner()).equal(ETHEREUM_SHORT_EXECUTOR);
    });
    it("Deployer should not be listed at ACLManager in any role", async () => {
      const { deployer } = await hre.getNamedAccounts();
      const acl = await getACLManager();

      await expect(await acl.isAssetListingAdmin(deployer)).be.false;
      await expect(await acl.isBridge(deployer)).be.false;
      await expect(await acl.isEmergencyAdmin(deployer)).be.false;
      await expect(await acl.isPoolAdmin(deployer)).be.false;
      await expect(await acl.isFlashBorrower(deployer)).be.false;
      await expect(await acl.isRiskAdmin(deployer)).be.false;
    });
    it("Treasury controller admin should be short executor", async () => {
      const controllerArtifact = await hre.deployments.get(
        TREASURY_CONTROLLER_ID
      );
      const controller = AaveEcosystemReserveController__factory.connect(
        controllerArtifact.address,
        await getFirstSigner()
      );

      expect(await controller.owner()).equal(ETHEREUM_SHORT_EXECUTOR);
    });
    it("ParawapRepayAdapter should be short executor", async () => {
      const paraswapRepayAdapter = await getOwnableContract(
        await (
          await hre.deployments.get("ParaSwapRepayAdapter")
        ).address
      );
      const owner = await paraswapRepayAdapter.owner();
      expect(owner).equal(ETHEREUM_SHORT_EXECUTOR);
    });
    it("ParawapSwapAdapter should be short executor", async () => {
      const paraswapSwapAdapter = await getOwnableContract(
        await (
          await hre.deployments.get("ParaSwapLiquiditySwapAdapter")
        ).address
      );

      const owner = await paraswapSwapAdapter.owner();
      expect(owner).equal(ETHEREUM_SHORT_EXECUTOR);
    });
    it("Emission Manager owner should be short executor", async () => {
      const manager = await getEmissionManager();

      const owner = await manager.owner();

      expect(owner).to.be.equal(ETHEREUM_SHORT_EXECUTOR);
    });
    it("Expect RewardsController admin to be the Emission Manager", async () => {
      const manager = await getEmissionManager();
      const controller = await getIncentivesV2();

      await expect(await controller.EMISSION_MANAGER()).equal(manager.address);
    });
  });
});
