import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("WalletBalanceProvider", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });
};

func.tags = ["periphery-post", "walletProvider"];

export default func;
