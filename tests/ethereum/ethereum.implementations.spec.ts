import { expect } from "chai";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
  ATOKEN_IMPL_ID,
  ConfigNames,
  DELEGATION_AWARE_ATOKEN_IMPL_ID,
  getAToken,
  getIncentivesV2,
  getPool,
  getPoolAddressesProvider,
  getPoolConfiguratorProxy,
  getStableDebtToken,
  getVariableDebtToken,
  ICommonConfiguration,
  INCENTIVES_V2_IMPL_ID,
  loadPoolConfig,
  POOL_CONFIGURATOR_IMPL_ID,
  POOL_IMPL_ID,
  PoolAddressesProvider,
  STABLE_DEBT_TOKEN_IMPL_ID,
  VARIABLE_DEBT_TOKEN_IMPL_ID,
  ZERO_ADDRESS,
} from "../../helpers";
import { TREASURY_IMPL_ID } from "../../helpers/deploy-ids";
import { getFirstSigner } from "../../helpers/utilities/signer";
import { AaveEcosystemReserveV2__factory } from "../../typechain/factories/@aave/periphery-v3/contracts/treasury/AaveEcosystemReserveV2__factory";

// Prevent error HH9 when importing this file inside tasks or helpers at Hardhat config load
declare var hre: HardhatRuntimeEnvironment;

const InitializeError = "Contract instance has already been initialized";

describe("Ethereum V3 - Token-less deployment: Implementations", function () {
  let addressesProvider: PoolAddressesProvider;
  let poolConfig: ICommonConfiguration;
  before(async () => {
    expect(process.env.MARKET_NAME).equal("Ethereum");

    await hre.deployments.fixture(["market", "periphery-post", "after-deploy"]);

    addressesProvider = await getPoolAddressesProvider();
    poolConfig = loadPoolConfig((process.env.MARKET_NAME || "") as ConfigNames);
  });

  describe("Implementations check-list", async () => {
    it("Pool implementation should be initialized", async () => {
      const poolImpl = await getPool(
        (
          await hre.deployments.get(POOL_IMPL_ID)
        ).address
      );
      await expect(
        poolImpl.initialize(addressesProvider.address)
      ).to.be.revertedWith(InitializeError);
    });
    it("PoolConfigurator implementation should be initialized", async () => {
      const poolConfigImpl = await getPoolConfiguratorProxy(
        (
          await hre.deployments.get(POOL_CONFIGURATOR_IMPL_ID)
        ).address
      );
      await expect(
        poolConfigImpl.initialize(addressesProvider.address)
      ).to.be.revertedWith(InitializeError);
    });
    it("RewardsController implementation should be initialized", async () => {
      const poolRewardsController = await getIncentivesV2(
        (
          await hre.deployments.get(INCENTIVES_V2_IMPL_ID)
        ).address
      );
      await expect(
        poolRewardsController.initialize(addressesProvider.address)
      ).to.be.revertedWith(InitializeError);
    });
    it("Treasury implementation should be initialized", async () => {
      const treasuryArtifact = await hre.deployments.get(TREASURY_IMPL_ID);
      const treasuryImpl = AaveEcosystemReserveV2__factory.connect(
        treasuryArtifact.address,
        await getFirstSigner()
      );

      await expect(treasuryImpl.initialize(ZERO_ADDRESS)).to.be.revertedWith(
        InitializeError
      );
    });
  });
  describe("Aave Tokens implementations", () => {
    it("Aave Tokens should be deployed and implementations initialized", async () => {
      const aaveToken = await getAToken(
        (
          await hre.deployments.get(ATOKEN_IMPL_ID)
        ).address
      );
      const delegationToken = await getAToken(
        (
          await hre.deployments.get(DELEGATION_AWARE_ATOKEN_IMPL_ID)
        ).address
      );
      const variableDebtToken = await getVariableDebtToken(
        (
          await hre.deployments.get(VARIABLE_DEBT_TOKEN_IMPL_ID)
        ).address
      );
      const stableDebtToken = await getStableDebtToken(
        (
          await hre.deployments.get(STABLE_DEBT_TOKEN_IMPL_ID)
        ).address
      );

      await expect(
        aaveToken.initialize(
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          0,
          "0",
          "0",
          "0x"
        )
      ).to.be.revertedWith(InitializeError);

      await expect(
        delegationToken.initialize(
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          0,
          "0",
          "0",
          "0x"
        )
      ).to.be.revertedWith(InitializeError);

      await expect(
        variableDebtToken.initialize(
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          0,
          "0",
          "0",
          "0x"
        )
      ).to.be.revertedWith(InitializeError);

      await expect(
        stableDebtToken.initialize(
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          0,
          "0",
          "0",
          "0x"
        )
      ).to.be.revertedWith(InitializeError);
    });
  });
});
