import { task } from "hardhat/config";
import { getERC20FaucetOwnable } from "../../helpers/contract-getters";

task(
  `transfer-faucet-ownership`,
  `Transfers ownership of the faucet to relayer`
)
  .addParam("owner", "new owners address")
  .setAction(async ({ owner }, hre) => {
    const { deployer } = await hre.getNamedAccounts();

    const faucetContract = await getERC20FaucetOwnable();

    console.log(`Faucet contract transfered to new owner ${owner}`);

    const tx = await faucetContract.transferOwnership(owner);

    console.log(`Faucet contract transfered to relayer ${owner}`);
    console.log(`TX ${tx}`);
  });
