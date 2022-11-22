import {
  ConfigNames,
  isTestnetMarket,
  loadPoolConfig,
} from "./../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { WRAPPED_NATIVE_TOKEN_PER_NETWORK } from "../../helpers/constants";
import { eNetwork } from "../../helpers/types";
import { POOL_PROXY_ID, TESTNET_TOKEN_PREFIX } from "../../helpers";
import { MARKET_NAME } from "../../helpers/env";

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

  let wrappedNativeTokenAddress;

  // Local networks that are not live or testnet, like hardhat network, will deploy a WETH9 contract as mockup for testing deployments
  if (isTestnetMarket(poolConfig)) {
    wrappedNativeTokenAddress = (
      await deployments.get(
        `${poolConfig.WrappedNativeTokenSymbol}${TESTNET_TOKEN_PREFIX}`
      )
    ).address;
  } else {
    if (!WRAPPED_NATIVE_TOKEN_PER_NETWORK[network]) {
      throw `Missing Wrapped native token for network: ${network}, fill the missing configuration at ./helpers/constants.ts`;
    }
    wrappedNativeTokenAddress = WRAPPED_NATIVE_TOKEN_PER_NETWORK[network];
  }

  const { address: poolAddress } = await deployments.get(POOL_PROXY_ID);

  await deploy("WrappedTokenGatewayV3", {
    from: deployer,
    args: [wrappedNativeTokenAddress, deployer, poolAddress],
  });
};

func.tags = ["periphery-post", "WrappedTokenGateway"];
func.dependencies = [];
func.id = "WrappedTokenGateway";

export default func;
