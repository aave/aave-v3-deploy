import { loadPoolConfig } from "./../../helpers/market-config-helpers";
import {
  getAToken,
  getPoolAddressesProvider,
} from "./../../helpers/contract-getters";
import {
  ATOKEN_IMPL_ID,
  INCENTIVES_PROXY_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  TREASURY_PROXY_ID,
} from "./../../helpers/deploy-ids";
import { getAddressFromJson } from "./../../helpers/utilities/tx";
import { getAaveProtocolDataProvider } from "../../helpers/contract-getters";
import { waitForTx } from "../../helpers/utilities/tx";
import { getPoolConfiguratorProxy } from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import { FORK } from "../../helpers/hardhat-config-helpers";
import { COMMON_DEPLOY_PARAMS, MARKET_NAME } from "../../helpers/env";

// Returns true if tokens upgraded, false if not

task(`upgrade-atokens`)
  .addParam("revision")
  .setAction(
    async ({ revision }, { deployments, getNamedAccounts, ...hre }) => {
      const { deployer } = await getNamedAccounts();
      const network = FORK ? FORK : hre.network.name;

      if (!MARKET_NAME) {
        console.error("Missing MARKET_NAME env variable. Exiting.");
        return false;
      }
      const { ATokenNamePrefix, SymbolPrefix } = await loadPoolConfig(
        MARKET_NAME
      );

      const poolAddressesProvider = await getPoolAddressesProvider(
        await getAddressFromJson(network, POOL_ADDRESSES_PROVIDER_ID)
      );

      const treasury = await getAddressFromJson(network, TREASURY_PROXY_ID);

      const incentivesController = await getAddressFromJson(
        network,
        INCENTIVES_PROXY_ID
      );
      const protocolDataProvider = await getAaveProtocolDataProvider(
        await poolAddressesProvider.getPoolDataProvider()
      );

      const poolConfigurator = await getPoolConfiguratorProxy(
        await poolAddressesProvider.getPoolConfigurator()
      );

      const reserves = await protocolDataProvider.getAllReservesTokens();

      const newAtokenArtifact = await deployments.deploy(ATOKEN_IMPL_ID, {
        contract: "AToken",
        from: deployer,
        args: [await poolAddressesProvider.getPool()],
        ...COMMON_DEPLOY_PARAMS,
      });
      const deployedRevision = await (
        await (await getAToken(newAtokenArtifact.address)).ATOKEN_REVISION()
      ).toString();
      if (deployedRevision !== revision) {
        console.error(
          `- Deployed AToken implementation revision ${deployedRevision} does not match expected revision ${revision}`
        );
        return false;
      }
      for (let x = 0; x < reserves.length; x++) {
        const [symbol, asset] = reserves[x];

        console.log(`- Updating a${symbol}...`);
        await waitForTx(
          await poolConfigurator.updateAToken({
            asset,
            treasury,
            incentivesController,
            name: `Aave ${ATokenNamePrefix} ${symbol}`,
            symbol: `a${SymbolPrefix}${symbol}`,
            implementation: newAtokenArtifact.address,
            params: [],
          })
        );
        console.log(`  - Updated implementation of a${symbol}`);
      }
    }
  );
