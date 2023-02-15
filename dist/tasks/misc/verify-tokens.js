"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const helpers_1 = require("../../helpers");
(0, config_1.task)(`verify-tokens`).setAction(async (_, { deployments, getNamedAccounts, ...hre }) => {
    const network = hre.network.name;
    const dataProvider = await (0, helpers_1.getAaveProtocolDataProvider)(await (0, helpers_1.getAddressFromJson)(network, helpers_1.POOL_DATA_PROVIDER));
    const poolConfigurator = await (0, helpers_1.getPoolConfiguratorProxy)(await (0, helpers_1.getAddressFromJson)(network, helpers_1.POOL_CONFIGURATOR_PROXY_ID));
    const reserves = await dataProvider.getAllReservesTokens();
    for (let x = 0; x < reserves.length; x++) {
        const { symbol, tokenAddress } = reserves[x];
        console.log(`- Verifying ${symbol} proxies:`);
        const { aTokenAddress, stableDebtTokenAddress, variableDebtTokenAddress, } = await dataProvider.getReserveTokensAddresses(tokenAddress);
        try {
            await hre.run("verify:verify", {
                address: aTokenAddress,
                constructorArguments: [poolConfigurator.address],
            });
        }
        catch (error) {
            console.error(error);
        }
        try {
            await hre.run("verify:verify", {
                address: stableDebtTokenAddress,
                constructorArguments: [poolConfigurator.address],
            });
        }
        catch (error) {
            console.error(error);
        }
        try {
            await hre.run("verify:verify", {
                address: variableDebtTokenAddress,
                constructorArguments: [poolConfigurator.address],
            });
        }
        catch (error) {
            console.error(error);
        }
    }
});
