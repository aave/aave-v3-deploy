"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../helpers/constants");
const tx_1 = require("./../../helpers/utilities/tx");
const signer_1 = require("./../../helpers/utilities/signer");
const env_1 = require("./../../helpers/env");
const market_config_helpers_1 = require("./../../helpers/market-config-helpers");
const constants_2 = require("../../helpers/constants");
const deploy_ids_1 = require("../../helpers/deploy-ids");
const env_2 = require("../../helpers/env");
const deploy_ids_2 = require("../../helpers/deploy-ids");
const helpers_1 = require("../../helpers");
const typechain_1 = require("../../typechain");
const utils_1 = require("ethers/lib/utils");
/**
 * @notice A treasury proxy can be deployed per network or per market.
 * You need to take care to upgrade this proxy to the desired implementation.
 */
const func = async function ({ getNamedAccounts, deployments, ...hre }) {
    const { deploy, save } = deployments;
    const { deployer } = await getNamedAccounts();
    const { ReserveFactorTreasuryAddress } = await (0, market_config_helpers_1.loadPoolConfig)(env_1.MARKET_NAME);
    const network = (process.env.FORK || hre.network.name);
    const treasuryAddress = (0, market_config_helpers_1.getParamPerNetwork)(ReserveFactorTreasuryAddress, network);
    let treasuryOwner = constants_1.POOL_ADMIN[network];
    if ((0, market_config_helpers_1.isTestnetMarket)(await (0, market_config_helpers_1.loadPoolConfig)(env_1.MARKET_NAME))) {
        treasuryOwner = deployer;
    }
    if (treasuryAddress && (0, utils_1.getAddress)(treasuryAddress) !== constants_2.ZERO_ADDRESS) {
        const treasuryContract = await typechain_1.AaveEcosystemReserveV2__factory.connect(treasuryAddress, await (0, signer_1.getFirstSigner)());
        const controller = await treasuryContract.getFundsAdmin();
        const impl = await (0, tx_1.getProxyImplementationBySlot)(treasuryAddress);
        await save(deploy_ids_2.TREASURY_PROXY_ID, {
            address: treasuryAddress,
            abi: typechain_1.InitializableAdminUpgradeabilityProxy__factory.abi,
        });
        await save(deploy_ids_1.TREASURY_CONTROLLER_ID, {
            address: controller,
            abi: typechain_1.AaveEcosystemReserveController__factory.abi,
        });
        await save(deploy_ids_1.TREASURY_IMPL_ID, {
            address: impl,
            abi: typechain_1.AaveEcosystemReserveV2__factory.abi,
        });
        return true;
    }
    // Deploy Treasury proxy
    const treasuryProxyArtifact = await deploy(deploy_ids_2.TREASURY_PROXY_ID, {
        from: deployer,
        contract: "InitializableAdminUpgradeabilityProxy",
        args: [],
    });
    // Deploy Treasury Controller
    const treasuryController = await deploy(deploy_ids_1.TREASURY_CONTROLLER_ID, {
        from: deployer,
        contract: "AaveEcosystemReserveController",
        args: [treasuryOwner],
        ...env_2.COMMON_DEPLOY_PARAMS,
    });
    // Deploy Treasury implementation and initialize proxy
    const treasuryImplArtifact = await deploy(deploy_ids_1.TREASURY_IMPL_ID, {
        from: deployer,
        contract: "AaveEcosystemReserveV2",
        args: [],
        ...env_2.COMMON_DEPLOY_PARAMS,
    });
    const treasuryImpl = (await hre.ethers.getContractAt(treasuryImplArtifact.abi, treasuryImplArtifact.address));
    // Call to initialize at implementation contract to prevent other calls.
    await (0, helpers_1.waitForTx)(await treasuryImpl.initialize(constants_2.ZERO_ADDRESS));
    // Initialize proxy
    const proxy = (await hre.ethers.getContractAt(treasuryProxyArtifact.abi, treasuryProxyArtifact.address));
    const initializePayload = treasuryImpl.interface.encodeFunctionData("initialize", [treasuryController.address]);
    await (0, helpers_1.waitForTx)(await proxy["initialize(address,address,bytes)"](treasuryImplArtifact.address, treasuryOwner, initializePayload));
    return true;
};
func.tags = ["periphery-pre", "TreasuryProxy"];
func.dependencies = [];
func.id = "Treasury";
exports.default = func;
