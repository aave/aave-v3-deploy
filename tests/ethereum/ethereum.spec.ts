import { parseEther } from "ethers/lib/utils";
import {
  MAX_UINT_AMOUNT,
  oneEther,
  WRAPPED_NATIVE_TOKEN_PER_NETWORK,
} from "./../../helpers/constants";
import { waitForTx } from "./../../helpers/utilities/tx";
import { impersonateAddress } from "./../../helpers/utilities/fork";
import { AaveEcosystemReserveController__factory } from "./../../typechain/factories/@aave/periphery-v3/contracts/treasury/AaveEcosystemReserveController__factory";
import { Ownable } from "./../../dist/types/typechain/@aave/core-v3/contracts/dependencies/openzeppelin/contracts/Ownable.d";
import { getTreasuryAddress } from "./../../helpers/market-config-helpers";
import {
  getERC20,
  getFlashLoanLogic,
  getOwnableContract,
} from "./../../helpers/contract-getters";
import {
  getEthersSigners,
  getFirstSigner,
} from "./../../helpers/utilities/signer";
import { AaveEcosystemReserveV2__factory } from "./../../typechain/factories/@aave/periphery-v3/contracts/treasury/AaveEcosystemReserveV2__factory";
import {
  INCENTIVES_PROXY_ID,
  TREASURY_CONTROLLER_ID,
  TREASURY_IMPL_ID,
  TREASURY_PROXY_ID,
} from "./../../helpers/deploy-ids";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  aave,
  ATOKEN_IMPL_ID,
  ConfigNames,
  DELEGATION_AWARE_ATOKEN_IMPL_ID,
  ETHEREUM_SHORT_EXECUTOR,
  getAaveOracle,
  getAaveProtocolDataProvider,
  getACLManager,
  getAToken,
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
  POOL_CONFIGURATOR_IMPL_ID,
  POOL_IMPL_ID,
  STABLE_DEBT_TOKEN_IMPL_ID,
  strategyWETH,
  VARIABLE_DEBT_TOKEN_IMPL_ID,
  ZERO_ADDRESS,
} from "../../helpers";

// Prevent error HH9 when importing this file inside tasks or helpers at Hardhat config load
declare var hre: HardhatRuntimeEnvironment;

const InitializeError = "Contract instance has already been initialized";

describe("Ethereum V3 - Token-less deployment", function () {
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

  describe("Governance", () => {
    it("Governance short executor should be able to list WETH", async () => {
      const { RateStrategies } = poolConfig;

      const firstStrat = Object.keys(RateStrategies)[0];

      const rateStrategy = await hre.deployments.get(
        `ReserveStrategy-${firstStrat}`
      );

      const impersonatedExecutor = await impersonateAddress(
        ETHEREUM_SHORT_EXECUTOR
      );
      const deployer = await getFirstSigner();
      await deployer.sendTransaction({
        to: ETHEREUM_SHORT_EXECUTOR,
        value: oneEther,
      });

      const poolConfigurator = (await getPoolConfiguratorProxy()).connect(
        impersonatedExecutor.signer
      );

      // List WETH for testing purposes
      await waitForTx(
        await poolConfigurator.initReserves([
          {
            aTokenImpl: (await hre.deployments.get(ATOKEN_IMPL_ID)).address,
            stableDebtTokenImpl: (
              await hre.deployments.get(STABLE_DEBT_TOKEN_IMPL_ID)
            ).address,
            variableDebtTokenImpl: (
              await hre.deployments.get(VARIABLE_DEBT_TOKEN_IMPL_ID)
            ).address,
            underlyingAssetDecimals: 18,
            interestRateStrategyAddress: rateStrategy.address,
            underlyingAsset: WRAPPED_NATIVE_TOKEN_PER_NETWORK["main"],
            treasury: (await hre.deployments.get(TREASURY_PROXY_ID)).address,
            incentivesController: (
              await hre.deployments.get(INCENTIVES_PROXY_ID)
            ).address,
            aTokenName: "WETH Ethereum AToken",
            aTokenSymbol: "aEthWETH",
            variableDebtTokenName: "WETH Ethereum Variable Debt Token",
            variableDebtTokenSymbol: "vDebtEthWETH",
            stableDebtTokenName: "WETH Ethereum Stable Debt Token",
            stableDebtTokenSymbol: "WETH Ethereum AToken",
            params: "0x",
          },
        ])
      );

      // Config WETH risk params
      const payload = {
        asset: WRAPPED_NATIVE_TOKEN_PER_NETWORK["main"],
        baseLTV: strategyWETH.baseLTVAsCollateral,
        liquidationThreshold: strategyWETH.liquidationThreshold,
        liquidationBonus: strategyWETH.liquidationBonus,
        reserveFactor: strategyWETH.reserveFactor,
        borrowCap: strategyWETH.borrowCap,
        supplyCap: strategyWETH.supplyCap,
        stableBorrowingEnabled: strategyWETH.stableBorrowRateEnabled,
        borrowingEnabled: strategyWETH.borrowingEnabled,
        flashLoanEnabled: strategyWETH.flashLoanEnabled,
      };
      await waitForTx(
        await poolConfigurator.configureReserveAsCollateral(
          payload.asset,
          payload.baseLTV,
          payload.liquidationThreshold,
          payload.liquidationBonus
        )
      );
      await waitForTx(
        await poolConfigurator.setReserveBorrowing(
          payload.asset,
          payload.borrowingEnabled
        )
      );
      await waitForTx(
        await poolConfigurator.setBorrowCap(payload.asset, payload.borrowCap)
      );
      await waitForTx(
        await poolConfigurator.setReserveStableRateBorrowing(
          payload.asset,
          payload.stableBorrowingEnabled
        )
      );
      await waitForTx(
        await poolConfigurator.setSupplyCap(payload.asset, payload.supplyCap)
      );
      await waitForTx(
        await poolConfigurator.setReserveFactor(
          payload.asset,
          payload.reserveFactor
        )
      );
      await waitForTx(
        await poolConfigurator.setReserveFlashLoaning(payload.asset, true)
      );
      const aaveOracle = (await getAaveOracle()).connect(
        impersonatedExecutor.signer
      );
      await waitForTx(
        await aaveOracle.setAssetSources(
          [payload.asset],
          ["0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"]
        )
      );
      // Unpause
      await waitForTx(await poolConfigurator.setPoolPause(false));
    });
  });
  describe("Perform user actions", () => {
    it("Supply WETH", async () => {
      const deployer = await getFirstSigner();
      const [, , user] = await getEthersSigners();
      const userAddress = await user.getAddress();
      const wrapper = await getWrappedTokenGateway();
      const pool = await getPool();

      await expect(
        wrapper
          .connect(user)
          .depositETH(ZERO_ADDRESS, userAddress, 0, { value: oneEther })
      ).to.emit(pool, "Supply");

      await expect(
        wrapper.depositETH(ZERO_ADDRESS, await deployer.getAddress(), 0, {
          value: parseEther("100"),
        })
      ).to.emit(pool, "Supply");
    });
    it("Borrow WETH variable debt", async () => {
      const [, , user] = await getEthersSigners();
      const wrapper = await getWrappedTokenGateway();
      const pool = await getPool();
      const weth = WRAPPED_NATIVE_TOKEN_PER_NETWORK["main"];
      const data = await pool.getReserveData(weth);
      const borrowSize = oneEther.div(4);
      const debtToken = await hre.ethers.getContractAt(
        "VariableDebtToken",
        data.variableDebtTokenAddress
      );
      await waitForTx(
        await debtToken
          .connect(user)
          .approveDelegation(wrapper.address, borrowSize)
      );
      await expect(
        wrapper.connect(user).borrowETH(ZERO_ADDRESS, borrowSize, 2, 0)
      ).to.emit(pool, "Borrow");
    });
    it("Repay WETH variable debt", async () => {
      const [, , user] = await getEthersSigners();
      const userAddress = await user.getAddress();
      const wrapper = await getWrappedTokenGateway();
      const pool = await getPool();
      const weth = WRAPPED_NATIVE_TOKEN_PER_NETWORK["main"];
      const data = await pool.getReserveData(weth);

      await expect(
        wrapper
          .connect(user)
          .repayETH(ZERO_ADDRESS, oneEther.div(4), 2, userAddress, {
            value: oneEther.div(4),
          })
      ).to.emit(pool, "Repay");
    });
  });
});
