"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const contract_getters_1 = require("../../helpers/contract-getters");
const config_1 = require("hardhat/config");
const tx_1 = require("../../helpers/utilities/tx");
const contract_getters_2 = require("../../helpers/contract-getters");
const env_1 = require("../../helpers/env");
const chalk_1 = __importDefault(require("chalk"));
const process_1 = require("process");
// This task will review the InterestRate strategy of each reserve from a Market passed by environment variable MARKET_NAME.
// If the fix flag is present it will change the current strategy of the reserve to the desired strategy from market configuration.
(0, config_1.task)(`review-stable-borrow`, ``)
    // Flag to fix the reserve deploying a new InterestRateStrategy contract with the strategy from market configuration:
    // --fix
    .addFlag("fix")
    .addFlag("vvv")
    // Optional parameter to check only the desired tokens by symbol and separated by comma
    // --checkOnly DAI,USDC,ETH
    .addOptionalParam("checkOnly")
    .setAction(async ({ fix, vvv, checkOnly, }, hre) => {
    const { poolAdmin } = await hre.getNamedAccounts();
    const checkOnlyReserves = checkOnly ? checkOnly.split(",") : [];
    const dataProvider = await (0, contract_getters_2.getAaveProtocolDataProvider)();
    const poolConfigurator = (await (0, contract_getters_1.getPoolConfiguratorProxy)()).connect(await hre.ethers.getSigner(poolAdmin));
    const poolConfig = await (0, market_config_helpers_1.loadPoolConfig)(env_1.MARKET_NAME);
    const reserves = await dataProvider.getAllReservesTokens();
    const reservesToCheck = checkOnlyReserves.length
        ? reserves.filter(([reserveSymbol]) => checkOnlyReserves.includes(reserveSymbol))
        : reserves;
    const reserveAssets = await dataProvider.getAllReservesTokens();
    const normalizedSymbols = Object.keys(poolConfig.ReservesConfig);
    if (!reserveAssets) {
        console.error("- Exiting due missing ReserveAssets");
        (0, process_1.exit)(2);
    }
    for (let index = 0; index < reservesToCheck.length; index++) {
        const { symbol, tokenAddress } = reservesToCheck[index];
        const normalizedSymbol = normalizedSymbols.find((s) => symbol.toUpperCase().includes(s.toUpperCase()));
        if (!normalizedSymbol) {
            console.error(`- Missing address ${tokenAddress} at ReserveAssets configuration.`);
            (0, process_1.exit)(3);
        }
        console.log("- Checking reserve", symbol, `, normalized symbol`, normalizedSymbol);
        const expectedStableRateEnabled = poolConfig.ReservesConfig[normalizedSymbol.toUpperCase()]
            .stableBorrowRateEnabled;
        const onChainStableRateEnabled = (await dataProvider.getReserveConfigurationData(tokenAddress)).stableBorrowRateEnabled;
        const delta = expectedStableRateEnabled !== onChainStableRateEnabled;
        if (delta) {
            if (vvv) {
                console.log("- Found differences of Borrow Stable Rate Enabled for ", normalizedSymbol);
                console.log("  - Expected:", expectedStableRateEnabled);
                console.log("  - Current :", onChainStableRateEnabled);
            }
            if (!fix) {
                continue;
            }
            vvv &&
                console.log("[FIX] Updating the Borrow Stable Rate Enabled for", normalizedSymbol);
            await (0, tx_1.waitForTx)(await poolConfigurator.setReserveStableRateBorrowing(tokenAddress, expectedStableRateEnabled));
            const newOnChainStableRateEnabled = (await dataProvider.getReserveConfigurationData(tokenAddress)).stableBorrowRateEnabled;
            vvv &&
                console.log("[FIX] Set ", normalizedSymbol, "Stable Rate Borrowing to", newOnChainStableRateEnabled);
        }
        else {
            vvv &&
                console.log(chalk_1.default.green(`  - Reserve ${normalizedSymbol} Borrow Stable Rate follows the expected configuration`));
            continue;
        }
    }
});
