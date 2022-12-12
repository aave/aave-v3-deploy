import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { getAccountPath, zeroPad } from "ethers/lib/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Config } from "jsondiffpatch";
import {
  aave,
  addMarketToRegistry,
  ATOKEN_IMPL_ID,
  ConfigNames,
  DebtTokenBase__factory,
  DELEGATION_AWARE_ATOKEN_IMPL_ID,
  ETHEREUM_SHORT_EXECUTOR,
  getAaveOracle,
  getAaveProtocolDataProvider,
  getACLManager,
  getAToken,
  getEthersSigners,
  getEthersSignersAddresses,
  getIncentivesV2,
  getIRStrategy,
  getPool,
  getPoolAddressesProvider,
  getPoolAddressesProviderRegistry,
  getPoolConfiguratorProxy,
  getStableDebtToken,
  getUiIncentiveDataProvider,
  getUiPoolDataProvider,
  getVariableDebtToken,
  getWrappedTokenGateway,
  ICommonConfiguration,
  INCENTIVES_V2_IMPL_ID,
  loadPoolConfig,
  PoolAddressesProvider,
  PoolAddressesProviderRegistry__factory,
  POOL_CONFIGURATOR_IMPL_ID,
  POOL_IMPL_ID,
  STABLE_DEBT_TOKEN_IMPL_ID,
  VARIABLE_DEBT_TOKEN_IMPL_ID,
  waitForTx,
  ZERO_ADDRESS,
} from "../../helpers";
import { pool } from "../../typechain/@aave/core-v3/contracts/protocol";

// Prevent error HH9 when importing this file inside tasks or helpers at Hardhat config load
declare var hre: HardhatRuntimeEnvironment;

const InitializeError = "Contract instance has already been initialized";

describe("Ethereum V3 - Token-less deployment", () => {
  let addressesProvider: PoolAddressesProvider;
  let poolConfig: ICommonConfiguration;
  before(async () => {
    expect(process.env.MARKET_NAME).equal("Ethereum");

    if (process.env.FORK_DEPLOY === "true") {
      await hre.deployments.fixture([
        "market",
        "periphery-post",
        "after-deploy",
      ]);
    }

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
    it("Owner should be short executor", async () => {
      const registry = await getPoolAddressesProviderRegistry();
      expect(await registry.owner()).equals(ETHEREUM_SHORT_EXECUTOR);
    });
  });

  describe("Oracle setup", () => {
    it("AaveOracle should not contain a FallbackOracle", async () => {
      const aaveOracle = await getAaveOracle();
      await expect(await aaveOracle.getFallbackOracle()).equal(ZERO_ADDRESS);
    });
  });

  describe("ACL Roles", () => {
    it("ACLManager admin should be short executor", async () => {
      const acl = await getACLManager();
      const DefaultAdminRole = await acl.DEFAULT_ADMIN_ROLE();
      await expect(await acl.getRoleAdmin(DefaultAdminRole)).equal(
        ETHEREUM_SHORT_EXECUTOR
      );
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
      await expect(addressesProvider.getACLAdmin()).equal(
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
  });

  describe("UI Helpers", () => {
    it("UiPoolDataProvider should be deployed and do not reverts", async () => {
      const ui = await getUiPoolDataProvider();
      const [, , anyone] = await getEthersSignersAddresses();
      await expect(ui.getReservesList(addressesProvider.address)).to.not.be
        .reverted;
      await expect(ui.getReservesData(addressesProvider.address)).to.not.be
        .reverted;
      await expect(ui.getUserReservesData(addressesProvider.address, anyone)).to
        .not.be.reverted;
    });
    it("UiIncentives should be deployed and do not reverts", async () => {
      const incentivesHelper = await getUiIncentiveDataProvider();
      await expect(
        incentivesHelper.getReservesIncentivesData(addressesProvider.address)
      ).to.not.be.reverted;
    });
    it("PoolDataProvider should be deployed and do not reverts", async () => {
      const dataProvider = await getAaveProtocolDataProvider();
      await expect(dataProvider.getAllReservesTokens()).to.not.be.reverted;
      await expect(await dataProvider.getAllReservesTokens()).to.be.deep.equal(
        []
      );
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

  describe("Paraswap adapters", () => {
    it("Paraswap Adapters should be deployed", async () => {
      const paraswapLiquidityAdapter = await hre.deployments.getOrNull(
        "ParaSwapLiquiditySwapAdapter"
      );
      const paraswapRepayAdapter = await hre.deployments.getOrNull(
        "ParaSwapRepayAdapter"
      );
      expect(paraswapLiquidityAdapter).to.not.be.null;
      expect(paraswapRepayAdapter).to.not.be.null;
    });
  });

  describe("Governance", () => {
    xit("Governance short executor should be able to list assets", async () => {});
    xit("Governance short executor should be able to unpause market", async () => {});
  });
});
