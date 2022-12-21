import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
  ATOKEN_IMPL_ID,
  ConfigNames,
  ETHEREUM_SHORT_EXECUTOR,
  getAaveOracle,
  getPool,
  getPoolConfiguratorProxy,
  getWrappedTokenGateway,
  ICommonConfiguration,
  loadPoolConfig,
  STABLE_DEBT_TOKEN_IMPL_ID,
  strategyWETH,
  VARIABLE_DEBT_TOKEN_IMPL_ID,
  ZERO_ADDRESS,
} from "../../helpers";
import {
  oneEther,
  WRAPPED_NATIVE_TOKEN_PER_NETWORK,
} from "../../helpers/constants";
import {
  INCENTIVES_PROXY_ID,
  TREASURY_PROXY_ID,
} from "../../helpers/deploy-ids";
import { impersonateAddress } from "../../helpers/utilities/fork";
import {
  getEthersSigners,
  getFirstSigner,
} from "../../helpers/utilities/signer";
import { waitForTx } from "../../helpers/utilities/tx";

// Prevent error HH9 when importing this file inside tasks or helpers at Hardhat config load
declare var hre: HardhatRuntimeEnvironment;

describe("Ethereum V3 - Token-less deployment: Governance and user actions", function () {
  let poolConfig: ICommonConfiguration;
  before(async () => {
    expect(process.env.MARKET_NAME).equal("Ethereum");

    await hre.deployments.fixture(["market", "periphery-post", "after-deploy"]);

    poolConfig = loadPoolConfig((process.env.MARKET_NAME || "") as ConfigNames);
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
      await expect(
        poolConfigurator.initReserves([
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
      ).to.emit(poolConfigurator, "ReserveInitialized");

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
    it("Supply WETH via WrappedTokenGateway", async () => {
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
    it("Borrow WETH variable debt via WrappedTokenGateway", async () => {
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
    it("Repay WETH variable debt via WrappedTokenGateway", async () => {
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
