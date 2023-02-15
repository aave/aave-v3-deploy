"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_config_helpers_1 = require("./helpers/hardhat-config-helpers");
const types_1 = require("./helpers/types");
const constants_1 = require("./helpers/constants");
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require("hardhat-dependency-compiler");
require("@nomicfoundation/hardhat-chai-matchers");
const SKIP_LOAD = process.env.SKIP_LOAD === "true";
const TASK_FOLDERS = ["misc", "market-registry"];
// Prevent to load tasks before compilation and typechain
if (!SKIP_LOAD) {
    (0, hardhat_config_helpers_1.loadTasks)(TASK_FOLDERS);
}
exports.default = {
    contractSizer: {
        alphaSort: true,
        runOnCompile: false,
        disambiguatePaths: false,
    },
    solidity: {
        compilers: [
            {
                version: "0.8.10",
                settings: {
                    optimizer: { enabled: true, runs: 100000 },
                    evmVersion: "berlin",
                },
            },
            {
                version: "0.7.5",
                settings: {
                    optimizer: { enabled: true, runs: 100000 },
                },
            },
        ],
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
    },
    networks: {
        hardhat: hardhat_config_helpers_1.hardhatNetworkSettings,
        localhost: {
            url: "http://127.0.0.1:8545",
            ...hardhat_config_helpers_1.hardhatNetworkSettings,
        },
        tenderly: (0, hardhat_config_helpers_1.getCommonNetworkConfig)("tenderly", 3030),
        main: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eEthereumNetwork.main, 1),
        kovan: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eEthereumNetwork.kovan, 42),
        rinkeby: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eEthereumNetwork.rinkeby, 4),
        ropsten: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eEthereumNetwork.ropsten, 3),
        [types_1.ePolygonNetwork.polygon]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.ePolygonNetwork.polygon, 137),
        [types_1.ePolygonNetwork.mumbai]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.ePolygonNetwork.mumbai, 80001),
        arbitrum: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eArbitrumNetwork.arbitrum, 42161),
        [types_1.eArbitrumNetwork.arbitrumTestnet]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eArbitrumNetwork.arbitrumTestnet, 421611),
        [types_1.eHarmonyNetwork.main]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eHarmonyNetwork.main, 1666600000),
        [types_1.eHarmonyNetwork.testnet]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eHarmonyNetwork.testnet, 1666700000),
        [types_1.eAvalancheNetwork.avalanche]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eAvalancheNetwork.avalanche, 43114),
        [types_1.eAvalancheNetwork.fuji]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eAvalancheNetwork.fuji, 43113),
        [types_1.eFantomNetwork.main]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eFantomNetwork.main, 250),
        [types_1.eFantomNetwork.testnet]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eFantomNetwork.testnet, 4002),
        [types_1.eOptimismNetwork.testnet]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eOptimismNetwork.testnet, 420),
        [types_1.eOptimismNetwork.main]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eOptimismNetwork.main, 10),
        [types_1.eEthereumNetwork.goerli]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eEthereumNetwork.goerli, 5),
        [types_1.eArbitrumNetwork.goerliNitro]: (0, hardhat_config_helpers_1.getCommonNetworkConfig)(types_1.eArbitrumNetwork.goerliNitro, 421613),
    },
    namedAccounts: {
        ...constants_1.DEFAULT_NAMED_ACCOUNTS,
    },
    mocha: {
        timeout: 0,
    },
    dependencyCompiler: {
        paths: [
            "@aave/core-v3/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol",
            "@aave/core-v3/contracts/protocol/configuration/PoolAddressesProvider.sol",
            "@aave/core-v3/contracts/misc/AaveOracle.sol",
            "@aave/core-v3/contracts/protocol/tokenization/AToken.sol",
            "@aave/core-v3/contracts/protocol/tokenization/DelegationAwareAToken.sol",
            "@aave/core-v3/contracts/protocol/tokenization/StableDebtToken.sol",
            "@aave/core-v3/contracts/protocol/tokenization/VariableDebtToken.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/GenericLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/ValidationLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/ReserveLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/SupplyLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/EModeLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/BorrowLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/BridgeLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/FlashLoanLogic.sol",
            "@aave/core-v3/contracts/protocol/libraries/logic/CalldataLogic.sol",
            "@aave/core-v3/contracts/protocol/pool/Pool.sol",
            "@aave/core-v3/contracts/protocol/pool/L2Pool.sol",
            "@aave/core-v3/contracts/protocol/pool/PoolConfigurator.sol",
            "@aave/core-v3/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol",
            "@aave/core-v3/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol",
            "@aave/core-v3/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol",
            "@aave/core-v3/contracts/deployments/ReservesSetupHelper.sol",
            "@aave/core-v3/contracts/misc/AaveProtocolDataProvider.sol",
            "@aave/core-v3/contracts/misc/L2Encoder.sol",
            "@aave/core-v3/contracts/protocol/configuration/ACLManager.sol",
            "@aave/core-v3/contracts/dependencies/weth/WETH9.sol",
            "@aave/core-v3/contracts/mocks/helpers/MockIncentivesController.sol",
            "@aave/core-v3/contracts/mocks/helpers/MockReserveConfiguration.sol",
            "@aave/core-v3/contracts/mocks/oracle/CLAggregators/MockAggregator.sol",
            "@aave/core-v3/contracts/mocks/tokens/MintableERC20.sol",
            "@aave/core-v3/contracts/mocks/flashloan/MockFlashLoanReceiver.sol",
            "@aave/core-v3/contracts/mocks/tokens/WETH9Mocked.sol",
            "@aave/core-v3/contracts/mocks/upgradeability/MockVariableDebtToken.sol",
            "@aave/core-v3/contracts/mocks/upgradeability/MockAToken.sol",
            "@aave/core-v3/contracts/mocks/upgradeability/MockStableDebtToken.sol",
            "@aave/core-v3/contracts/mocks/upgradeability/MockInitializableImplementation.sol",
            "@aave/core-v3/contracts/mocks/helpers/MockPool.sol",
            "@aave/core-v3/contracts/mocks/helpers/MockL2Pool.sol",
            "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol",
            "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol",
            "@aave/core-v3/contracts/mocks/oracle/PriceOracle.sol",
            "@aave/core-v3/contracts/mocks/tokens/MintableDelegationERC20.sol",
            "@aave/periphery-v3/contracts/misc/UiPoolDataProviderV3.sol",
            "@aave/periphery-v3/contracts/misc/WalletBalanceProvider.sol",
            "@aave/periphery-v3/contracts/misc/WrappedTokenGatewayV3.sol",
            "@aave/periphery-v3/contracts/misc/interfaces/IWETH.sol",
            "@aave/periphery-v3/contracts/misc/UiIncentiveDataProviderV3.sol",
            "@aave/periphery-v3/contracts/rewards/RewardsController.sol",
            "@aave/periphery-v3/contracts/rewards/transfer-strategies/StakedTokenTransferStrategy.sol",
            "@aave/periphery-v3/contracts/rewards/transfer-strategies/PullRewardsTransferStrategy.sol",
            "@aave/periphery-v3/contracts/rewards/EmissionManager.sol",
            "@aave/periphery-v3/contracts/mocks/WETH9Mock.sol",
            "@aave/periphery-v3/contracts/mocks/testnet-helpers/Faucet.sol",
            "@aave/periphery-v3/contracts/mocks/testnet-helpers/TestnetERC20.sol",
            "@aave/periphery-v3/contracts/treasury/Collector.sol",
            "@aave/periphery-v3/contracts/treasury/CollectorController.sol",
            "@aave/periphery-v3/contracts/treasury/AaveEcosystemReserveV2.sol",
            "@aave/periphery-v3/contracts/treasury/AaveEcosystemReserveController.sol",
            "@aave/periphery-v3/contracts/adapters/paraswap/ParaSwapLiquiditySwapAdapter.sol",
            "@aave/periphery-v3/contracts/adapters/paraswap/ParaSwapRepayAdapter.sol",
            "@aave/safety-module/contracts/stake/StakedAave.sol",
            "@aave/safety-module/contracts/stake/StakedAaveV2.sol",
            "@aave/safety-module/contracts/proposals/extend-stkaave-distribution/StakedTokenV2Rev3.sol",
        ],
    },
    deterministicDeployment: hardhat_config_helpers_1.DETERMINISTIC_DEPLOYMENT
        ? hardhat_config_helpers_1.DETERMINISTIC_FACTORIES
        : undefined,
    etherscan: {
        apiKey: hardhat_config_helpers_1.ETHERSCAN_KEY,
    },
};
