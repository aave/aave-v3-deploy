import { task } from "hardhat/config";
import {
  getFaucet,
  getWrappedTokenGateway,
  getPoolConfiguratorProxy,
} from "../../helpers/contract-getters";
import { waitForTx } from "../../helpers/utilities/tx";

task(
  `disable-faucet-native-testnets`,
  `Disables faucet of native tokens and borrowing of native tokens`
).setAction(async ({}, hre) => {
  const { deployer } = await hre.getNamedAccounts();
  const signer = await hre.ethers.getSigner(deployer);

  const faucetContract = await getFaucet();

  const wrappedTokenGatewayV3 = await getWrappedTokenGateway();

  const getWrappedTokenAddress = await wrappedTokenGatewayV3.getWETHAddress();

  console.log(
    `Faucet contract to disable minting for asset ${getWrappedTokenAddress}`
  );

  await waitForTx(
    await faucetContract
      .connect(signer)
      .setMintable(getWrappedTokenAddress, false)
  );

  console.log(
    `Faucet contract disabled minting for asset ${getWrappedTokenAddress}`
  );

  const poolConfiguratorProxyContract = await getPoolConfiguratorProxy();

  console.log(
    `Update reserve for asset ${getWrappedTokenAddress} to setReserveBorrowing to false`
  );

  await waitForTx(
    await poolConfiguratorProxyContract
      .connect(signer)
      .setReserveBorrowing(getWrappedTokenAddress, false)
  );

  console.log(
    `Successfully updated reserve for asset ${getWrappedTokenAddress} to setReserveBorrowing to false`
  );
});
