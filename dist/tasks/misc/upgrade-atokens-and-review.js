"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const jsondiffpatch_1 = require("jsondiffpatch");
(0, config_1.task)(`upgrade-atokens-and-review`)
    .addParam("revision")
    .setAction(async ({ revision }, { deployments, getNamedAccounts, ...hre }) => {
    const previousATokenConfigs = await hre.run("review-atokens", { log: true });
    // Perform Action
    const tokensUpgraded = await hre.run("upgrade-atokens", { revision });
    if (tokensUpgraded) {
    }
    const afterATokensConfig = await hre.run("review-atokens", { log: true });
    // Checks
    const delta = (0, jsondiffpatch_1.diff)(afterATokensConfig, previousATokenConfigs);
    if (delta) {
        console.log("=== Updated ATokens, check new configuration differences ===");
        console.log(jsondiffpatch_1.formatters.console.format(delta, afterATokensConfig));
    }
    else {
        console.log("- ATokens are not upgraded, check logs, noop");
    }
});
