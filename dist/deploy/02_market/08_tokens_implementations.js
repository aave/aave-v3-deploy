"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../helpers/env");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const constants_1 = require("../../helpers/constants");
const helpers_1 = require("../../helpers");
const env_2 = require("../../helpers/env");
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const { address: addressesProvider } = await deployments.get(deploy_ids_1.POOL_ADDRESSES_PROVIDER_ID);
    const addressesProviderInstance = (await (0, helpers_1.getContract)("PoolAddressesProvider", addressesProvider));
    const poolAddress = await addressesProviderInstance.getPool();
    const aTokenArtifact = await deploy(deploy_ids_1.ATOKEN_IMPL_ID, {
        contract: "AToken",
        from: deployer,
        args: [poolAddress],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const aToken = (await hre.ethers.getContractAt(aTokenArtifact.abi, aTokenArtifact.address));
    await (0, helpers_1.waitForTx)(await aToken.initialize(poolAddress, // initializingPool
    constants_1.ZERO_ADDRESS, // treasury
    constants_1.ZERO_ADDRESS, // underlyingAsset
    constants_1.ZERO_ADDRESS, // incentivesController
    0, // aTokenDecimals
    "ATOKEN_IMPL", // aTokenName
    "ATOKEN_IMPL", // aTokenSymbol
    "0x00" // params
    ));
    const delegationAwareATokenArtifact = await deploy(deploy_ids_1.DELEGATION_AWARE_ATOKEN_IMPL_ID, {
        contract: "DelegationAwareAToken",
        from: deployer,
        args: [poolAddress],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const delegationAwareAToken = (await hre.ethers.getContractAt(delegationAwareATokenArtifact.abi, delegationAwareATokenArtifact.address));
    await (0, helpers_1.waitForTx)(await delegationAwareAToken.initialize(poolAddress, // initializingPool
    constants_1.ZERO_ADDRESS, // treasury
    constants_1.ZERO_ADDRESS, // underlyingAsset
    constants_1.ZERO_ADDRESS, // incentivesController
    0, // aTokenDecimals
    "DELEGATION_AWARE_ATOKEN_IMPL", // aTokenName
    "DELEGATION_AWARE_ATOKEN_IMPL", // aTokenSymbol
    "0x00" // params
    ));
    const stableDebtTokenArtifact = await deploy(deploy_ids_1.STABLE_DEBT_TOKEN_IMPL_ID, {
        contract: "StableDebtToken",
        from: deployer,
        args: [poolAddress],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const stableDebtToken = (await hre.ethers.getContractAt(stableDebtTokenArtifact.abi, stableDebtTokenArtifact.address));
    await (0, helpers_1.waitForTx)(await stableDebtToken.initialize(poolAddress, // initializingPool
    constants_1.ZERO_ADDRESS, // underlyingAsset
    constants_1.ZERO_ADDRESS, // incentivesController
    0, // debtTokenDecimals
    "STABLE_DEBT_TOKEN_IMPL", // debtTokenName
    "STABLE_DEBT_TOKEN_IMPL", // debtTokenSymbol
    "0x00" // params
    ));
    const variableDebtTokenArtifact = await deploy(deploy_ids_1.VARIABLE_DEBT_TOKEN_IMPL_ID, {
        contract: "VariableDebtToken",
        from: deployer,
        args: [poolAddress],
        ...env_1.COMMON_DEPLOY_PARAMS,
    });
    const variableDebtToken = (await hre.ethers.getContractAt(variableDebtTokenArtifact.abi, variableDebtTokenArtifact.address));
    await (0, helpers_1.waitForTx)(await variableDebtToken.initialize(poolAddress, // initializingPool
    constants_1.ZERO_ADDRESS, // underlyingAsset
    constants_1.ZERO_ADDRESS, // incentivesController
    0, // debtTokenDecimals
    "VARIABLE_DEBT_TOKEN_IMPL", // debtTokenName
    "VARIABLE_DEBT_TOKEN_IMPL", // debtTokenSymbol
    "0x00" // params
    ));
    return true;
};
func.id = `TokenImplementations:${env_2.MARKET_NAME}:aave-v3-core@${constants_1.V3_CORE_VERSION}`;
func.tags = ["market", "tokens"];
exports.default = func;
