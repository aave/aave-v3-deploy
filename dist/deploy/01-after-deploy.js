"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_config_helpers_1 = require("./../helpers/market-config-helpers");
const env_1 = require("../helpers/env");
const helpers_1 = require("../helpers");
/**
 * The following script runs after the deployment starts
 */
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    console.log("=== Post deployment hook ===");
    const poolConfig = (0, market_config_helpers_1.loadPoolConfig)(env_1.MARKET_NAME);
    console.log("- Enable stable borrow in selected assets");
    await hre.run("review-stable-borrow", { fix: true, vvv: true });
    console.log("- Review rate strategies");
    await hre.run("review-rate-strategies");
    console.log("- Setup Debt Ceiling");
    await hre.run("setup-debt-ceiling");
    console.log("- Setup Borrowable assets in Isolation Mode");
    await hre.run("setup-isolation-mode");
    console.log("- Setup E-Modes");
    await hre.run("setup-e-modes");
    console.log("- Setup Liquidation protocol fee");
    await hre.run("setup-liquidation-protocol-fee");
    if ((0, market_config_helpers_1.isTestnetMarket)(poolConfig)) {
        // Unpause pool
        const poolConfigurator = await (0, helpers_1.getPoolConfiguratorProxy)();
        await (0, helpers_1.waitForTx)(await poolConfigurator.setPoolPause(false));
        console.log("- Pool unpaused and accepting deposits.");
    }
    if (process.env.TRANSFER_OWNERSHIP === "true") {
        await hre.run("transfer-protocol-ownership");
        await hre.run("renounce-pool-admin");
        await hre.run("view-protocol-roles");
    }
    await hre.run("print-deployments");
};
func.tags = ["after-deploy"];
func.runAtTheEnd = true;
exports.default = func;
