import { task } from "hardhat/config";
import { diff, formatters } from "jsondiffpatch";

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

task(`upgrade-atokens-and-review`)
  .addParam("revision")
  .setAction(
    async ({ revision }, { deployments, getNamedAccounts, ...hre }) => {
      const previousATokenConfigs: { [key: string]: ATokenConfig } =
        await hre.run("review-atokens", { log: true });

      // Perform Action
      const tokensUpgraded = await hre.run("upgrade-atokens", { revision });
      if (tokensUpgraded) {
      }

      const afterATokensConfig: { [key: string]: ATokenConfig } = await hre.run(
        "review-atokens",
        { log: true }
      );

      // Checks
      const delta = diff(afterATokensConfig, previousATokenConfigs);
      if (delta) {
        console.log(
          "=== Updated ATokens, check new configuration differences ==="
        );
        console.log(formatters.console.format(delta, afterATokensConfig));
      } else {
        console.log("- ATokens are not upgraded, check logs, noop");
      }
    }
  );
