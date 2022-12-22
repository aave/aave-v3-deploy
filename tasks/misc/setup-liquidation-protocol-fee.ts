import { getReserveAddress } from "../../helpers/market-config-helpers";
import { task } from "hardhat/config";
import { waitForTx } from "../../helpers/utilities/tx";
import {
  ConfigNames,
  loadPoolConfig,
} from "../../helpers/market-config-helpers";
import { getPoolConfiguratorProxy } from "../../helpers/contract-getters";
import { BigNumber } from "ethers";
import { MARKET_NAME } from "../../helpers/env";

task(
  `setup-liquidation-protocol-fee`,
  `Setups reserve liquidation protocol fee from configuration`
).setAction(async (_, hre) => {
  const { poolAdmin } = await hre.getNamedAccounts();
  const config = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const poolConfigurator = (await getPoolConfiguratorProxy()).connect(
    await hre.ethers.getSigner(poolAdmin)
  );

  let assetsWithProtocolFees = [];
  for (let asset in config.ReservesConfig) {
    const liquidationProtocolFee = BigNumber.from(
      config.ReservesConfig[asset].liquidationProtocolFee
    );
    const assetAddress = await getReserveAddress(config, asset);

    if (liquidationProtocolFee && liquidationProtocolFee.gt("0")) {
      await waitForTx(
        await poolConfigurator.setLiquidationProtocolFee(
          assetAddress,
          liquidationProtocolFee
        )
      );
      assetsWithProtocolFees.push(asset);
    }
  }

  if (assetsWithProtocolFees.length) {
    console.log(
      "- Successfully setup liquidation protocol fee:",
      assetsWithProtocolFees.join(", ")
    );
  } else {
    console.log(
      "- None of the assets has the liquidation protocol fee enabled at market configuration"
    );
  }
});
