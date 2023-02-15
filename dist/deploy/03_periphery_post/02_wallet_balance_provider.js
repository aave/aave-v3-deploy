"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../helpers/env");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy("WalletBalanceProvider", {
        from: deployer,
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
};
func.tags = ["periphery-post", "walletProvider"];
exports.default = func;
