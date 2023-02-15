"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const helpers_1 = require("../../helpers");
(0, config_1.task)(`print-deployments`).setAction(async (_, { deployments, getNamedAccounts, ...hre }) => {
    const allDeployments = await deployments.all();
    let formattedDeployments = {};
    let mintableTokens = {};
    console.log("\nAccounts after deployment");
    console.log("========");
    console.table(await (0, helpers_1.getWalletBalances)());
    // Print deployed contracts
    console.log("\nDeployments");
    console.log("===========");
    Object.keys(allDeployments).forEach((key) => {
        if (!key.includes("Mintable")) {
            formattedDeployments[key] = {
                address: allDeployments[key].address,
            };
        }
    });
    console.table(formattedDeployments);
    // Print Mintable Reserves and Rewards
    Object.keys(allDeployments).forEach((key) => {
        if (key.includes("Mintable")) {
            mintableTokens[key] = {
                address: allDeployments[key].address,
            };
        }
    });
    console.log("\nMintable Reserves and Rewards");
    console.table(mintableTokens);
});
