import { task } from "hardhat/config";
import {
  eNetwork,
  getAaveProtocolDataProvider,
  getAddressFromJson,
  getPoolConfiguratorProxy,
  POOL_CONFIGURATOR_PROXY_ID,
  POOL_DATA_PROVIDER,
} from "../../helpers";

task(`verify-tokens`).setAction(
  async (_, { deployments, getNamedAccounts, ...hre }) => {
    const network = hre.network.name as eNetwork;
    const dataProvider = await getAaveProtocolDataProvider(
      await getAddressFromJson(network, POOL_DATA_PROVIDER)
    );
    const poolConfigurator = await getPoolConfiguratorProxy(
      await getAddressFromJson(network, POOL_CONFIGURATOR_PROXY_ID)
    );
    const reserves = await dataProvider.getAllReservesTokens();

    for (let x = 0; x < reserves.length; x++) {
      const { symbol, tokenAddress } = reserves[x];
      console.log(`- Verifying ${symbol} proxies:`);
      const {
        aTokenAddress,
        stableDebtTokenAddress,
        variableDebtTokenAddress,
      } = await dataProvider.getReserveTokensAddresses(tokenAddress);
      try {
        await hre.run("verify:verify", {
          address: aTokenAddress,
          constructorArguments: [poolConfigurator.address],
        });
      } catch (error) {
        console.error(error);
      }
      try {
        await hre.run("verify:verify", {
          address: stableDebtTokenAddress,
          constructorArguments: [poolConfigurator.address],
        });
      } catch (error) {
        console.error(error);
      }
      try {
        await hre.run("verify:verify", {
          address: variableDebtTokenAddress,
          constructorArguments: [poolConfigurator.address],
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
);
