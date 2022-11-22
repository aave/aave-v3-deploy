import { TESTNET_REWARD_TOKEN_PREFIX } from "./../../../helpers/deploy-ids";
import {
  getSymbolsByPrefix,
  isIncentivesEnabled,
} from "./../../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../../helpers/env";
import {
  checkRequiredEnvironment,
  ConfigNames,
  getReserveAddresses,
  isProductionMarket,
  loadPoolConfig,
} from "../../../helpers/market-config-helpers";
import { eNetwork } from "../../../helpers/types";
import { TESTNET_PRICE_AGGR_PREFIX } from "../../../helpers/deploy-ids";
import {
  MOCK_CHAINLINK_AGGREGATORS_PRICES,
  V3_CORE_VERSION,
} from "../../../helpers/constants";
import Bluebird from "bluebird";
import { MARKET_NAME } from "../../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  if (isProductionMarket(poolConfig)) {
    console.log("[NOTICE] Skipping deployment of testnet price aggregators");
    return;
  }

  const reserves = await getReserveAddresses(poolConfig, network);

  let symbols = Object.keys(reserves);

  if (isIncentivesEnabled(poolConfig)) {
    const rewards = await getSymbolsByPrefix(TESTNET_REWARD_TOKEN_PREFIX);
    symbols = [...symbols, ...rewards];
  }

  // Iterate each token symbol and deploy a mock aggregator
  await Bluebird.each(symbols, async (symbol) => {
    const price =
      symbol === "StkAave"
        ? MOCK_CHAINLINK_AGGREGATORS_PRICES["AAVE"]
        : MOCK_CHAINLINK_AGGREGATORS_PRICES[symbol];
    if (!price) {
      throw `[ERROR] Missing mock price for asset ${symbol} at MOCK_CHAINLINK_AGGREGATORS_PRICES constant located at src/constants.ts`;
    }
    await deploy(`${symbol}${TESTNET_PRICE_AGGR_PREFIX}`, {
      args: [price],
      from: deployer,
      ...COMMON_DEPLOY_PARAMS,
      contract: "MockAggregator",
    });
  });

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `MockPriceAggregators:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "init-testnet", "price-aggregators-setup"];

func.dependencies = ["before-deploy", "tokens-setup", "periphery-pre"];

func.skip = async () => checkRequiredEnvironment();

export default func;
