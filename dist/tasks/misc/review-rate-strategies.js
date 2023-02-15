"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signer_1 = require("../../helpers/utilities/signer");
const market_config_helpers_1 = require("../../helpers/market-config-helpers");
const contract_getters_1 = require("../../helpers/contract-getters");
const config_1 = require("hardhat/config");
const tx_1 = require("../../helpers/utilities/tx");
const contract_getters_2 = require("../../helpers/contract-getters");
const env_1 = require("../../helpers/env");
const hardhat_config_helpers_1 = require("../../helpers/hardhat-config-helpers");
const jsondiffpatch_1 = require("jsondiffpatch");
const chalk_1 = __importDefault(require("chalk"));
const process_1 = require("process");
// This task will review the InterestRate strategy of each reserve from a Market passed by environment variable MARKET_NAME.
// If the fix flag is present it will change the current strategy of the reserve to the desired strategy from market configuration.
(0, config_1.task)(`review-rate-strategies`, ``)
    // Flag to fix the reserve deploying a new InterestRateStrategy contract with the strategy from market configuration:
    // --fix
    .addFlag("fix")
    .addFlag("deploy")
    // Optional parameter to check only the desired tokens by symbol and separated by comma
    // --checkOnly DAI,USDC,ETH
    .addOptionalParam("checkOnly")
    .setAction(async ({ fix, deploy, checkOnly, }, hre) => {
    const network = hardhat_config_helpers_1.FORK ? hardhat_config_helpers_1.FORK : hre.network.name;
    const { deployer, poolAdmin } = await hre.getNamedAccounts();
    const checkOnlyReserves = checkOnly ? checkOnly.split(",") : [];
    const dataProvider = await (0, contract_getters_2.getAaveProtocolDataProvider)();
    const poolConfigurator = (await (0, contract_getters_1.getPoolConfiguratorProxy)()).connect(await hre.ethers.getSigner(poolAdmin));
    const poolAddressesProvider = await (0, contract_getters_1.getPoolAddressesProvider)();
    const poolConfig = await (0, market_config_helpers_1.loadPoolConfig)(env_1.MARKET_NAME);
    const reserves = await dataProvider.getAllReservesTokens();
    const reservesToCheck = checkOnlyReserves.length
        ? reserves.filter(([reserveSymbol]) => checkOnlyReserves.includes(reserveSymbol))
        : reserves;
    const normalizedSymbols = Object.keys(poolConfig.ReservesConfig);
    for (let index = 0; index < reservesToCheck.length; index++) {
        const { symbol, tokenAddress } = reservesToCheck[index];
        const normalizedSymbol = normalizedSymbols.find((s) => symbol.toUpperCase().includes(s.toUpperCase()));
        if (!normalizedSymbol) {
            console.error(`- Missing address ${tokenAddress} at ReserveAssets configuration.`);
            (0, process_1.exit)(3);
        }
        console.log("- Checking reserve", symbol, `, normalized symbol`, normalizedSymbol);
        const expectedStrategy = poolConfig.ReservesConfig[normalizedSymbol.toUpperCase()].strategy;
        const onChainStrategy = (await hre.ethers.getContractAt("DefaultReserveInterestRateStrategy", await dataProvider.getInterestRateStrategyAddress(tokenAddress), await (0, signer_1.getFirstSigner)()));
        const currentStrategy = {
            name: expectedStrategy.name,
            optimalUsageRatio: (await onChainStrategy.OPTIMAL_USAGE_RATIO()).toString(),
            baseVariableBorrowRate: await (await onChainStrategy.getBaseVariableBorrowRate()).toString(),
            variableRateSlope1: await (await onChainStrategy.getVariableRateSlope1()).toString(),
            variableRateSlope2: await (await onChainStrategy.getVariableRateSlope2()).toString(),
            stableRateSlope1: await (await onChainStrategy.getStableRateSlope1()).toString(),
            stableRateSlope2: await (await onChainStrategy.getStableRateSlope2()).toString(),
            baseStableRateOffset: await (await onChainStrategy.getBaseStableBorrowRate())
                .sub(await onChainStrategy.getVariableRateSlope1())
                .toString(),
            stableRateExcessOffset: await (await onChainStrategy.getStableRateExcessOffset()).toString(),
            optimalStableToTotalDebtRatio: await (await onChainStrategy.OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO()).toString(),
        };
        const delta = (0, jsondiffpatch_1.diff)(currentStrategy, expectedStrategy);
        if (delta) {
            console.log(`- Found ${chalk_1.default.red("differences")} at reserve ${normalizedSymbol} versus expected "${expectedStrategy.name}" strategy from configuration`);
            console.log(chalk_1.default.red("Current strategy", "=>", chalk_1.default.green("Desired strategy from config")));
            console.log(jsondiffpatch_1.formatters.console.format(delta, expectedStrategy));
            if (deploy) {
                console.log("  - Deploying a new instance of InterestRateStrategy");
                const deployArgs = [
                    poolAddressesProvider.address,
                    expectedStrategy.optimalUsageRatio,
                    expectedStrategy.baseVariableBorrowRate,
                    expectedStrategy.variableRateSlope1,
                    expectedStrategy.variableRateSlope2,
                    expectedStrategy.stableRateSlope1,
                    expectedStrategy.stableRateSlope2,
                    expectedStrategy.baseStableRateOffset,
                    expectedStrategy.stableRateExcessOffset,
                    expectedStrategy.optimalStableToTotalDebtRatio,
                ];
                const fixedInterestStrategy = await hre.deployments.deploy(`ReserveStrategy-${expectedStrategy.name}`, {
                    from: deployer,
                    args: deployArgs,
                    contract: "DefaultReserveInterestRateStrategy",
                    log: true,
                    deterministicDeployment: hre.ethers.utils.formatBytes32String(expectedStrategy.name),
                });
                console.log("  - Deployed new Reserve Interest Strategy of", normalizedSymbol, "at", fixedInterestStrategy.address);
                if (fix) {
                    await (0, tx_1.waitForTx)(await poolConfigurator.setReserveInterestRateStrategyAddress(tokenAddress, fixedInterestStrategy.address));
                    console.log("  - Updated Reserve Interest Strategy of", normalizedSymbol, "at", fixedInterestStrategy.address);
                }
            }
        }
        else {
            console.log(chalk_1.default.green(`  - Reserve ${normalizedSymbol} Interest Rate Strategy matches the expected configuration`));
            continue;
        }
    }
});
