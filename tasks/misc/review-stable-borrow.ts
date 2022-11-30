import { eNetwork } from "../../helpers/types";
import { loadPoolConfig } from "../../helpers/market-config-helpers";
import { getPoolConfiguratorProxy } from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import { waitForTx } from "../../helpers/utilities/tx";
import { getAaveProtocolDataProvider } from "../../helpers/contract-getters";
import { MARKET_NAME } from "../../helpers/env";
import { FORK } from "../../helpers/hardhat-config-helpers";
import chalk from "chalk";
import { exit } from "process";

// This task will review the InterestRate strategy of each reserve from a Market passed by environment variable MARKET_NAME.
// If the fix flag is present it will change the current strategy of the reserve to the desired strategy from market configuration.
task(`review-stable-borrow`, ``)
  // Flag to fix the reserve deploying a new InterestRateStrategy contract with the strategy from market configuration:
  // --fix
  .addFlag("fix")
  .addFlag("vvv")
  // Optional parameter to check only the desired tokens by symbol and separated by comma
  // --checkOnly DAI,USDC,ETH
  .addOptionalParam("checkOnly")
  .setAction(
    async (
      {
        fix,
        vvv,
        checkOnly,
      }: { fix: boolean; vvv: boolean; checkOnly: string },
      hre
    ) => {
      const { poolAdmin } = await hre.getNamedAccounts();
      const checkOnlyReserves: string[] = checkOnly ? checkOnly.split(",") : [];
      const dataProvider = await getAaveProtocolDataProvider();
      const poolConfigurator = (await getPoolConfiguratorProxy()).connect(
        await hre.ethers.getSigner(poolAdmin)
      );

      const poolConfig = await loadPoolConfig(MARKET_NAME);
      const reserves = await dataProvider.getAllReservesTokens();

      const reservesToCheck = checkOnlyReserves.length
        ? reserves.filter(([reserveSymbol]) =>
            checkOnlyReserves.includes(reserveSymbol)
          )
        : reserves;

      const reserveAssets = await dataProvider.getAllReservesTokens();
      const normalizedSymbols = Object.keys(poolConfig.ReservesConfig);
      if (!reserveAssets) {
        console.error("- Exiting due missing ReserveAssets");
        exit(2);
      }

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
        const expectedStableRateEnabled =
          poolConfig.ReservesConfig[normalizedSymbol.toUpperCase()]
            .stableBorrowRateEnabled;
        const onChainStableRateEnabled = (
          await dataProvider.getReserveConfigurationData(tokenAddress)
        ).stableBorrowRateEnabled;

        const delta = expectedStableRateEnabled !== onChainStableRateEnabled;
        if (delta) {
          if (vvv) {
            console.log(
              "- Found differences of Borrow Stable Rate Enabled for ",
              normalizedSymbol
            );
            console.log("  - Expected:", expectedStableRateEnabled);
            console.log("  - Current :", onChainStableRateEnabled);
          }
          if (!fix) {
            continue;
          }
          vvv &&
            console.log(
              "[FIX] Updating the Borrow Stable Rate Enabled for",
              normalizedSymbol
            );
          await waitForTx(
            await poolConfigurator.setReserveStableRateBorrowing(
              tokenAddress,
              expectedStableRateEnabled
            )
          );
          const newOnChainStableRateEnabled = (
            await dataProvider.getReserveConfigurationData(tokenAddress)
          ).stableBorrowRateEnabled;
          vvv &&
            console.log(
              "[FIX] Set ",
              normalizedSymbol,
              "Stable Rate Borrowing to",
              newOnChainStableRateEnabled
            );
        } else {
          vvv &&
            console.log(
              chalk.green(
                `  - Reserve ${normalizedSymbol} Borrow Stable Rate follows the expected configuration`
              )
            );
          continue;
        }
      }
    }
  );
