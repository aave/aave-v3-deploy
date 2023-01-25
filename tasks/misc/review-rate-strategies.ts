import { eNetwork } from "./../../helpers/types";
import { getFirstSigner } from "../../helpers/utilities/signer";
import { loadPoolConfig } from "../../helpers/market-config-helpers";
import {
  getPoolAddressesProvider,
  getPoolConfiguratorProxy,
} from "../../helpers/contract-getters";
import { IInterestRateStrategyParams } from "../../helpers/types";
import { task } from "hardhat/config";
import { waitForTx } from "../../helpers/utilities/tx";
import { getAaveProtocolDataProvider } from "../../helpers/contract-getters";
import { MARKET_NAME } from "../../helpers/env";
import { FORK } from "../../helpers/hardhat-config-helpers";
import { diff, formatters } from "jsondiffpatch";
import chalk from "chalk";
import { exit } from "process";
import { DefaultReserveInterestRateStrategy } from "../../typechain";

// This task will review the InterestRate strategy of each reserve from a Market passed by environment variable MARKET_NAME.
// If the fix flag is present it will change the current strategy of the reserve to the desired strategy from market configuration.
task(`review-rate-strategies`, ``)
  // Flag to fix the reserve deploying a new InterestRateStrategy contract with the strategy from market configuration:
  // --fix
  .addFlag("fix")
  .addFlag("deploy")
  // Optional parameter to check only the desired tokens by symbol and separated by comma
  // --checkOnly DAI,USDC,ETH
  .addOptionalParam("checkOnly")
  .setAction(
    async (
      {
        fix,
        deploy,
        checkOnly,
      }: { fix: boolean; checkOnly: string; deploy: boolean },
      hre
    ) => {
      const network = FORK ? FORK : (hre.network.name as eNetwork);
      const { deployer, poolAdmin } = await hre.getNamedAccounts();
      const checkOnlyReserves: string[] = checkOnly ? checkOnly.split(",") : [];
      const dataProvider = await getAaveProtocolDataProvider();
      const poolConfigurator = (await getPoolConfiguratorProxy()).connect(
        await hre.ethers.getSigner(poolAdmin)
      );
      const poolAddressesProvider = await getPoolAddressesProvider();
      const poolConfig = await loadPoolConfig(MARKET_NAME);
      const reserves = await dataProvider.getAllReservesTokens();

      const reservesToCheck = checkOnlyReserves.length
        ? reserves.filter(([reserveSymbol]) =>
            checkOnlyReserves.includes(reserveSymbol)
          )
        : reserves;

      const normalizedSymbols = Object.keys(poolConfig.ReservesConfig);

      for (let index = 0; index < reservesToCheck.length; index++) {
        const { symbol, tokenAddress } = reservesToCheck[index];

        const normalizedSymbol = normalizedSymbols.find((s) =>
          symbol.toUpperCase().includes(s.toUpperCase())
        );
        if (!normalizedSymbol) {
          console.error(
            `- Missing address ${tokenAddress} at ReserveAssets configuration.`
          );
          exit(3);
        }

        console.log(
          "- Checking reserve",
          symbol,
          `, normalized symbol`,
          normalizedSymbol
        );
        const expectedStrategy: IInterestRateStrategyParams =
          poolConfig.ReservesConfig[normalizedSymbol.toUpperCase()].strategy;
        const onChainStrategy = (await hre.ethers.getContractAt(
          "DefaultReserveInterestRateStrategy",
          await dataProvider.getInterestRateStrategyAddress(tokenAddress),
          await getFirstSigner()
        )) as DefaultReserveInterestRateStrategy;
        const currentStrategy: IInterestRateStrategyParams = {
          name: expectedStrategy.name,
          optimalUsageRatio: (
            await onChainStrategy.OPTIMAL_USAGE_RATIO()
          ).toString(),
          baseVariableBorrowRate: await (
            await onChainStrategy.getBaseVariableBorrowRate()
          ).toString(),
          variableRateSlope1: await (
            await onChainStrategy.getVariableRateSlope1()
          ).toString(),
          variableRateSlope2: await (
            await onChainStrategy.getVariableRateSlope2()
          ).toString(),
          stableRateSlope1: await (
            await onChainStrategy.getStableRateSlope1()
          ).toString(),
          stableRateSlope2: await (
            await onChainStrategy.getStableRateSlope2()
          ).toString(),
          baseStableRateOffset: await (
            await onChainStrategy.getBaseStableBorrowRate()
          )
            .sub(await onChainStrategy.getVariableRateSlope1())
            .toString(),
          stableRateExcessOffset: await (
            await onChainStrategy.getStableRateExcessOffset()
          ).toString(),
          optimalStableToTotalDebtRatio: await (
            await onChainStrategy.OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO()
          ).toString(),
        };

        const delta = diff(currentStrategy, expectedStrategy);
        if (delta) {
          console.log(
            `- Found ${chalk.red(
              "differences"
            )} at reserve ${normalizedSymbol} versus expected "${
              expectedStrategy.name
            }" strategy from configuration`
          );
          console.log(
            chalk.red(
              "Current strategy",
              "=>",
              chalk.green("Desired strategy from config")
            )
          );
          console.log(formatters.console.format(delta, expectedStrategy));

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
            const fixedInterestStrategy = await hre.deployments.deploy(
              `ReserveStrategy-${expectedStrategy.name}`,
              {
                from: deployer,
                args: deployArgs,
                contract: "DefaultReserveInterestRateStrategy",
                log: true,
                deterministicDeployment: hre.ethers.utils.formatBytes32String(
                  expectedStrategy.name
                ),
              }
            );
            console.log(
              "  - Deployed new Reserve Interest Strategy of",
              normalizedSymbol,
              "at",
              fixedInterestStrategy.address
            );
            if (fix) {
              await waitForTx(
                await poolConfigurator.setReserveInterestRateStrategyAddress(
                  tokenAddress,
                  fixedInterestStrategy.address
                )
              );
              console.log(
                "  - Updated Reserve Interest Strategy of",
                normalizedSymbol,
                "at",
                fixedInterestStrategy.address
              );
            }
          }
        } else {
          console.log(
            chalk.green(
              `  - Reserve ${normalizedSymbol} Interest Rate Strategy matches the expected configuration`
            )
          );
          continue;
        }
      }
    }
  );
