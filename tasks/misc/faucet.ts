import { task } from "hardhat/config";
import { getFaucet } from "../../helpers/contract-getters";

task(
  `transfer-faucet-ownership`,
  `Transfers ownership of the faucet to relayer`
)
  .addParam("owner", "new owners address")
  .setAction(async ({ owner }, hre) => {
    const { deployer } = await hre.getNamedAccounts();

    const faucetContract = await getFaucet();

    console.log(`Faucet contract transferred to new owner ${owner}`);

    const tx = await faucetContract.transferOwnership(owner);

    console.log(`Faucet contract transferred to relayer ${owner}`);
    console.log(`TX ${tx}`);
  });
