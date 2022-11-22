import { getAaveOracle } from "./../../helpers/contract-getters";
import { getAddressFromJson, waitForTx } from "../../helpers/utilities/tx";
import { task } from "hardhat/config";
import { FORK } from "../../helpers/hardhat-config-helpers";
import { eNetwork } from "../../helpers/types";
import { ORACLE_ID } from "../../helpers/deploy-ids";
import { getAddress } from "ethers/lib/utils";
import { ZERO_ADDRESS } from "../../helpers/constants";

task(`set-fallback-oracle`)
  .addOptionalParam("address")
  .setAction(async ({ address }, { deployments, getNamedAccounts, ...hre }) => {
    const { poolAdmin } = await getNamedAccounts();
    const network = FORK ? FORK : (hre.network.name as eNetwork);
    const signer = await hre.ethers.provider.getSigner(poolAdmin);

    const newFallbackOracleAddress = address
      ? getAddress(address)
      : ZERO_ADDRESS;

    const aaveOracle = await (
      await getAaveOracle(await getAddressFromJson(network, ORACLE_ID))
    ).connect(signer);

    await waitForTx(
      await aaveOracle.setFallbackOracle(newFallbackOracleAddress)
    );

    const updatedFallbackOracle = await aaveOracle.getFallbackOracle();

    console.table({
      "Fallback oracle": updatedFallbackOracle,
      assert: updatedFallbackOracle === newFallbackOracleAddress,
    });
  });
