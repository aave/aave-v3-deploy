"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
/**
 * The following script runs before the deployment starts
 */
const func = async function () {
    const balances = await (0, helpers_1.getWalletBalances)();
    console.log("\nAccounts");
    console.log("========");
    console.table(balances);
};
func.tags = ["before-deploy"];
func.runAtTheEnd = true;
exports.default = func;
