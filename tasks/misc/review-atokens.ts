import {
  getAToken,
  getPoolAddressesProvider,
} from "../../helpers/contract-getters";
import { POOL_ADDRESSES_PROVIDER_ID } from "../../helpers/deploy-ids";
import { getAddressFromJson } from "../../helpers/utilities/tx";
import { getAaveProtocolDataProvider } from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import { FORK } from "../../helpers/hardhat-config-helpers";

interface ATokenConfig {
  revision: string;
  name: string;
  symbol: string;
  decimals: string;
  treasury: string;
  incentives: string;
  pool: string;
  underlying: string;
}

task(`review-atokens`)
  .addFlag("log")
  .setAction(async ({ log }, { deployments, getNamedAccounts, ...hre }) => {
    console.log("start review");
    const network = FORK ? FORK : hre.network.name;

    const poolAddressesProvider = await getPoolAddressesProvider(
      await getAddressFromJson(network, POOL_ADDRESSES_PROVIDER_ID)
    );

    const protocolDataProvider = await getAaveProtocolDataProvider(
      await poolAddressesProvider.getPoolDataProvider()
    );

    const reserves = await protocolDataProvider.getAllATokens();

    const ATokenConfigs: { [key: string]: ATokenConfig } = {};
    for (let x = 0; x < reserves.length; x++) {
      const [symbol, asset] = reserves[x];

      const aToken = await getAToken(asset);

      ATokenConfigs[symbol] = {
        name: await aToken.name(),
        symbol: await aToken.symbol(),
        decimals: (await aToken.decimals()).toString(),
        revision: (await aToken.ATOKEN_REVISION()).toString(),
        treasury: await aToken.RESERVE_TREASURY_ADDRESS(),
        incentives: await aToken.getIncentivesController(),
        underlying: await aToken.UNDERLYING_ASSET_ADDRESS(),
        pool: await aToken.POOL(),
      };
    }
    if (log) {
      console.log("ATokens Config:");
      console.table(ATokenConfigs);
    }
    return ATokenConfigs;
  });
