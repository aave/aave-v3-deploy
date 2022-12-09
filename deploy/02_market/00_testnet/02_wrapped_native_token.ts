import { getERC20FaucetOwnable } from "./../../../helpers/contract-getters";
import {
  ConfigNames,
  isTestnetMarket,
  loadPoolConfig,
} from "../../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../../helpers/env";
import { WRAPPED_NATIVE_TOKEN_PER_NETWORK } from "../../../helpers/constants";
import { eNetwork } from "../../../helpers/types";
import { TESTNET_TOKEN_PREFIX } from "../../../helpers";
import { MARKET_NAME } from "../../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;
  const poolConfig = loadPoolConfig(MARKET_NAME as ConfigNames);

  // Local networks that are not live or testnet, like hardhat network, will deploy a WETH9 contract as mockup for testing deployments
  if (isTestnetMarket(poolConfig)) {
    const faucet = await getERC20FaucetOwnable();
    await deploy(
      `${poolConfig.WrappedNativeTokenSymbol}${TESTNET_TOKEN_PREFIX}`,
      {
        from: deployer,
        contract: "NativeWrapperMock",
        args: [
          poolConfig.WrappedNativeTokenSymbol,
          poolConfig.WrappedNativeTokenSymbol,
          faucet.address,
        ],
        ...COMMON_DEPLOY_PARAMS,
      }
    );
    return;
  }

  if (!WRAPPED_NATIVE_TOKEN_PER_NETWORK[network]) {
    throw `Missing Wrapped native token for network: ${network}, fill the missing configuration at ./helpers/constants.ts`;
  }
};

func.tags = ["market", "init-testnet", "token-setup", "WrappedNativeToken"];

func.dependencies = ["before-deploy", "periphery-pre"];

func.id = "WrappedNativeToken";

export default func;
