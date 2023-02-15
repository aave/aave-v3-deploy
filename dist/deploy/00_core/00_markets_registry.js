"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tx_1 = require("../../helpers/utilities/tx");
const env_1 = require("../../helpers/env");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy } = deployments;
    const { deployer, addressesProviderRegistryOwner } = await getNamedAccounts();
    const poolAddressesProviderRegistryArtifact = await deploy("PoolAddressesProviderRegistry", {
        from: deployer,
        args: [deployer],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const registryInstance = (await hre.ethers.getContractAt(poolAddressesProviderRegistryArtifact.abi, poolAddressesProviderRegistryArtifact.address)).connect(await hre.ethers.getSigner(deployer));
    await (0, tx_1.waitForTx)(await registryInstance.transferOwnership(addressesProviderRegistryOwner));
    deployments.log(`[Deployment] Transferred ownership of PoolAddressesProviderRegistry to: ${addressesProviderRegistryOwner} `);
    return true;
};
func.id = "PoolAddressesProviderRegistry";
func.tags = ["core", "registry"];
exports.default = func;
