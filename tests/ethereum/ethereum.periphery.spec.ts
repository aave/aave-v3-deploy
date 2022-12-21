import { expect } from "chai";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
  ConfigNames,
  getAaveProtocolDataProvider,
  getEthersSignersAddresses,
  getPoolAddressesProvider,
  getUiIncentiveDataProvider,
  getUiPoolDataProvider,
  ICommonConfiguration,
  loadPoolConfig,
  PoolAddressesProvider,
} from "../../helpers";

// Prevent error HH9 when importing this file inside tasks or helpers at Hardhat config load
declare var hre: HardhatRuntimeEnvironment;

describe("Ethereum V3 - Token-less deployment: periphery contracts", function () {
  let addressesProvider: PoolAddressesProvider;
  let poolConfig: ICommonConfiguration;
  before(async () => {
    expect(process.env.MARKET_NAME).equal("Ethereum");

    await hre.deployments.fixture(["market", "periphery-post", "after-deploy"]);

    addressesProvider = await getPoolAddressesProvider();
    poolConfig = loadPoolConfig((process.env.MARKET_NAME || "") as ConfigNames);
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
});
