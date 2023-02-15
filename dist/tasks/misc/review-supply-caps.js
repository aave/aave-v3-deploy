"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_ids_1 = require("../../helpers/deploy-ids");
const tx_1 = require("../../helpers/utilities/tx");
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const contract_getters_1 = require("../../helpers/contract-getters");
const config_1 = require("hardhat/config");
const tx_2 = require("../../helpers/utilities/tx");
const contract_getters_2 = require("../../helpers/contract-getters");
const env_1 = require("../../helpers/env");
const hardhat_config_helpers_1 = require("../../helpers/hardhat-config-helpers");
const chalk_1 = __importDefault(require("chalk"));
const process_1 = require("process");
const utils_1 = require("ethers/lib/utils");
// If the fix flag is present it will change the supply cap to the expected local market configuration
(0, config_1.task)(`review-supply-caps`, ``)
    // --fix
    .addFlag("fix")
    // Optional parameter to check only the desired tokens by symbol and separated by comma
    // --checkOnly DAI,USDC,ETH
    .addOptionalParam("checkOnly")
    .setAction(async ({ fix, checkOnly }, hre) => {
    const network = hardhat_config_helpers_1.FORK ? hardhat_config_helpers_1.FORK : hre.network.name;
    const { poolAdmin } = await hre.getNamedAccounts();
    const checkOnlyReserves = checkOnly ? checkOnly.split(",") : [];
    const dataProvider = await (0, contract_getters_2.getAaveProtocolDataProvider)(await (0, tx_1.getAddressFromJson)(network, deploy_ids_1.POOL_DATA_PROVIDER));
    const poolConfigurator = (await (0, contract_getters_1.getPoolConfiguratorProxy)(await (0, tx_1.getAddressFromJson)(network, deploy_ids_1.POOL_CONFIGURATOR_PROXY_ID))).connect(await hre.ethers.getSigner(poolAdmin));
    const poolConfig = await (0, market_config_helpers_1.loadPoolConfig)(env_1.MARKET_NAME);
    const reserves = await dataProvider.getAllReservesTokens();
    const reservesToCheck = checkOnlyReserves.length
        ? reserves.filter(([reserveSymbol]) => checkOnlyReserves.includes(reserveSymbol))
        : reserves;
    const reserveAssets = poolConfig.ReserveAssets?.[network];
    if (!reserveAssets) {
        console.log("Exiting due missing ReserveAssets");
        (0, process_1.exit)(2);
    }
    for (let index = 0; index < reservesToCheck.length; index++) {
        const { symbol, tokenAddress } = reservesToCheck[index];
        let normalizedSymbol = "";
        Object.values(reserveAssets).forEach((value, index) => {
            if ((0, utils_1.getAddress)(value) === (0, utils_1.getAddress)(tokenAddress)) {
                normalizedSymbol = Object.keys(reserveAssets)[index];
            }
        });
        if (!normalizedSymbol) {
            console.error(`- Missing address ${tokenAddress} at ReserveAssets configuration.`);
            (0, process_1.exit)(3);
        }
        console.log("- Checking reserve", symbol, `, normalized symbol`, normalizedSymbol);
        const expectedSupplyCap = poolConfig.ReservesConfig[normalizedSymbol.toUpperCase()].supplyCap;
        const onChainSupplyCap = (await dataProvider.getReserveCaps(tokenAddress)).supplyCap.toString();
        const delta = expectedSupplyCap !== onChainSupplyCap;
        if (delta) {
            console.log("- Found differences of the supply cap for ", normalizedSymbol);
            console.log("  - Expected:", Number(expectedSupplyCap).toLocaleString(undefined, {
                currency: "usd",
            }));
            console.log("  - Current :", Number(onChainSupplyCap).toLocaleString(undefined, {
                currency: "usd",
            }));
            if (!fix) {
                continue;
            }
            console.log("[FIX] Updating the supply cap for", normalizedSymbol);
            await (0, tx_2.waitForTx)(await poolConfigurator.setSupplyCap(tokenAddress, expectedSupplyCap));
            const newOnChainSupplyCap = (await dataProvider.getReserveCaps(tokenAddress)).supplyCap.toString();
            console.log("[FIX] Set ", normalizedSymbol, "Supply cap to", Number(newOnChainSupplyCap).toLocaleString(undefined, {
                currency: "usd",
            }));
        }
        else {
            console.log(chalk_1.default.green(`  - Reserve ${normalizedSymbol} supply cap follows the expected configuration`));
            continue;
        }
    }
});
