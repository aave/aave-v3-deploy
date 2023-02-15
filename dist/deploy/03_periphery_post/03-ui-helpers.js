"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../helpers/env");
const constants_1 = require("../../helpers/constants");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const network = (process.env.FORK ? process.env.FORK : hre.network.name);
    if (!constants_1.chainlinkAggregatorProxy[network]) {
        console.log('[Deployments] Skipping the deployment of UiPoolDataProvider due missing constant "chainlinkAggregatorProxy" configuration at ./helpers/constants.ts');
        return;
    }
    // Deploy UiIncentiveDataProvider getter helper
    await deploy("UiIncentiveDataProviderV3", {
        from: deployer,
    });
    // Deploy UiPoolDataProvider getter helper
    await deploy("UiPoolDataProviderV3", {
        from: deployer,
        args: [
            constants_1.chainlinkAggregatorProxy[network],
            constants_1.chainlinkEthUsdAggregatorProxy[network],
        ],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
};
func.tags = ["periphery-post", "ui-helpers"];
exports.default = func;
