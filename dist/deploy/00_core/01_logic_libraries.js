"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../helpers/env");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy("SupplyLogic", {
        from: deployer,
        args: [],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const borrowLogicArtifact = await deploy("BorrowLogic", {
        from: deployer,
        args: [],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    await deploy("LiquidationLogic", {
        from: deployer,
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    await deploy("EModeLogic", {
        from: deployer,
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    await deploy("BridgeLogic", {
        from: deployer,
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    await deploy("ConfiguratorLogic", {
        from: deployer,
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    await deploy("FlashLoanLogic", {
        from: deployer,
        ...env_1.COMMON_DEPLOY_PARAMS,
        libraries: {
            BorrowLogic: borrowLogicArtifact.address,
        },
    });
    await deploy("PoolLogic", {
        from: deployer,
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    return true;
};
func.id = "LogicLibraries";
func.tags = ["core", "logic"];
exports.default = func;
