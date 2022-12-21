import { expect } from "chai";
import { BigNumber } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
  ConfigNames,
  getAaveOracle,
  getAaveProtocolDataProvider,
  getACLManager,
  getIncentivesV2,
  getIRStrategy,
  getPool,
  getPoolAddressesProvider,
  getPoolAddressesProviderRegistry,
  getPoolConfiguratorProxy,
  ICommonConfiguration,
  loadPoolConfig,
  PoolAddressesProvider,
  ZERO_ADDRESS,
} from "../../helpers";
import {
  TREASURY_CONTROLLER_ID,
  TREASURY_PROXY_ID,
} from "./../../helpers/deploy-ids";
import { getFirstSigner } from "./../../helpers/utilities/signer";
import { AaveEcosystemReserveV2__factory } from "./../../typechain/factories/@aave/periphery-v3/contracts/treasury/AaveEcosystemReserveV2__factory";

// Prevent error HH9 when importing this file inside tasks or helpers at Hardhat config load
declare var hre: HardhatRuntimeEnvironment;

describe("Ethereum V3 - Token-less deployment: expected configs", function () {
  let addressesProvider: PoolAddressesProvider;
  let poolConfig: ICommonConfiguration;
  before(async () => {
    expect(process.env.MARKET_NAME).equal("Ethereum");

    await hre.deployments.fixture(["market", "periphery-post", "after-deploy"]);

    addressesProvider = await getPoolAddressesProvider();
    poolConfig = loadPoolConfig((process.env.MARKET_NAME || "") as ConfigNames);
  });

  describe("Reserves", () => {
    it("Market should not contain any reserves", async () => {
      const pool = await getPool();

      const assets = await pool.getReservesList();
      expect(assets.length).equal(0);
    });
  });

  describe("Treasury", () => {
    it("Treasury proxy should be deployed and initialized", async () => {
      const treasury = await hre.deployments.get(TREASURY_PROXY_ID);

      const treasuryProxy = AaveEcosystemReserveV2__factory.connect(
        treasury.address,
        await getFirstSigner()
      );

      expect(await treasuryProxy.getNextStreamId()).gte(100000);
    });
    it("Treasury owner should be the controller", async () => {
      const treasury = await hre.deployments.get(TREASURY_PROXY_ID);
      const controller = await hre.deployments.get(TREASURY_CONTROLLER_ID);

      const treasuryProxy = AaveEcosystemReserveV2__factory.connect(
        treasury.address,
        await getFirstSigner()
      );

      expect(await treasuryProxy.getFundsAdmin()).equal(controller.address);
    });
  });

  describe("AddressesProvider", () => {
    it("Pool proxy should be initialized", async () => {
      const pool = await getPool();
      expect(pool.address).not.equal(ZERO_ADDRESS);
      await expect(await addressesProvider.getPool()).equal(pool.address);
    });
    it("PoolConfigurator proxy should be initialized", async () => {
      const poolConfig = await getPoolConfiguratorProxy();
      expect(poolConfig.address).not.equal(ZERO_ADDRESS);
      await expect(await addressesProvider.getPoolConfigurator()).equal(
        poolConfig.address
      );
    });
    it("AaveOracle should be initialized", async () => {
      const aaveOracle = await getAaveOracle();
      expect(aaveOracle.address).not.equal(ZERO_ADDRESS);
      await expect(await addressesProvider.getPriceOracle()).equal(
        aaveOracle.address
      );
    });
    it("RewardsController proxy should be initialized", async () => {
      const rewardsController = await getIncentivesV2();
      const incentivesControllerId = hre.ethers.utils.keccak256(
        hre.ethers.utils.toUtf8Bytes("INCENTIVES_CONTROLLER")
      );
      expect(rewardsController.address).not.equal(ZERO_ADDRESS);
      await expect(
        await addressesProvider.getAddress(incentivesControllerId)
      ).equal(rewardsController.address);
    });
    it("ACLManager should be listed", async () => {
      const aclManager = await getACLManager();
      expect(aclManager).not.equal(ZERO_ADDRESS);
      await expect(await addressesProvider.getACLManager()).equal(
        aclManager.address
      );
    });
    it("PoolDataProvider should be listed", async () => {
      const dataProvider = await getAaveProtocolDataProvider();
      expect(dataProvider).not.equal(dataProvider.address);
      await expect(await addressesProvider.getPoolDataProvider()).equal(
        dataProvider.address
      );
    });
    it("Market id should match config", async () => {
      await expect(await addressesProvider.getMarketId()).equals(
        poolConfig.MarketId
      );
    });
  });

  describe("AddressesProviderRegistry", () => {
    it("Market should be added to the AddressesProviderRegistry", async () => {
      const registry = await getPoolAddressesProviderRegistry();
      await expect(
        await registry.getAddressesProviderAddressById(poolConfig.ProviderId)
      ).equal(addressesProvider.address);
      await expect(
        await registry.getAddressesProviderIdByAddress(
          addressesProvider.address
        )
      ).equal(poolConfig.ProviderId);
    });
  });

  describe("Oracle setup", () => {
    it("AaveOracle should not contain a FallbackOracle", async () => {
      const aaveOracle = await getAaveOracle();
      await expect(await aaveOracle.getFallbackOracle()).equal(ZERO_ADDRESS);
    });
  });

  describe("IR Strategies", () => {
    it("IR Strategies parameters should match from configuration", async () => {
      const { RateStrategies } = poolConfig;

      // Expect to be more than zero Rate Strategies
      expect(Object.keys(RateStrategies).length).gt(0);

      for (const strategy in RateStrategies) {
        const rateStrategy = await hre.deployments.getOrNull(
          `ReserveStrategy-${strategy}`
        );
        expect(rateStrategy, `RateStrategy ${strategy} is missing`).to.not.be
          .null;

        const strategyData = RateStrategies[strategy];
        const strategyContract = await getIRStrategy(
          rateStrategy?.address || ""
        );

        await expect(await strategyContract.OPTIMAL_USAGE_RATIO()).equal(
          strategyData.optimalUsageRatio
        );
        await expect(await strategyContract.getBaseVariableBorrowRate()).equal(
          strategyData.baseVariableBorrowRate
        );
        await expect(await strategyContract.getVariableRateSlope1()).equal(
          strategyData.variableRateSlope1
        );
        await expect(await strategyContract.getVariableRateSlope2()).equal(
          strategyData.variableRateSlope2
        );
        await expect(await strategyContract.getStableRateSlope1()).equal(
          strategyData.stableRateSlope1
        );
        await expect(await strategyContract.getStableRateSlope2()).equal(
          strategyData.stableRateSlope2
        );
        await expect(await strategyContract.getBaseStableBorrowRate()).equal(
          BigNumber.from(strategyData.variableRateSlope1).add(
            strategyData.baseStableRateOffset
          )
        );
        await expect(await strategyContract.getStableRateExcessOffset()).equal(
          strategyData.stableRateExcessOffset
        );
        await expect(
          await strategyContract.OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO()
        ).equal(strategyData.optimalStableToTotalDebtRatio);
        await expect(await strategyContract.getMaxVariableBorrowRate()).equal(
          BigNumber.from(strategyData.baseVariableBorrowRate)
            .add(strategyData.variableRateSlope1)
            .add(strategyData.variableRateSlope2)
        );
      }
    });
  });

  describe("Pool config", () => {
    it(`Should have set the Flash Loan total fees`, async () => {
      const { FlashLoanPremiums } = poolConfig;
      const pool = await getPool();
      const currentPremiumTotal = await pool.FLASHLOAN_PREMIUM_TOTAL();
      const currentProtocolFee = await pool.FLASHLOAN_PREMIUM_TO_PROTOCOL();

      expect(currentPremiumTotal).equal(FlashLoanPremiums.total);
      expect(currentProtocolFee).equal(FlashLoanPremiums.protocol);
    });
  });
});
