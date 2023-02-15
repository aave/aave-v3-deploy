"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferStrategy = exports.AssetType = exports.RateMode = exports.TokenContractId = exports.ProtocolErrors = exports.eContractid = exports.AavePools = exports.EthereumNetworkNames = exports.eHarmonyNetwork = exports.eArbitrumNetwork = exports.eAvalancheNetwork = exports.eXDaiNetwork = exports.ePolygonNetwork = exports.eEthereumNetwork = exports.eOptimismNetwork = exports.eFantomNetwork = exports.eTenderly = void 0;
var eTenderly;
(function (eTenderly) {
    eTenderly["fork"] = "tenderly-fork";
})(eTenderly = exports.eTenderly || (exports.eTenderly = {}));
var eFantomNetwork;
(function (eFantomNetwork) {
    eFantomNetwork["main"] = "fantom";
    eFantomNetwork["testnet"] = "fantom-testnet";
})(eFantomNetwork = exports.eFantomNetwork || (exports.eFantomNetwork = {}));
var eOptimismNetwork;
(function (eOptimismNetwork) {
    eOptimismNetwork["main"] = "optimism";
    eOptimismNetwork["testnet"] = "optimism-testnet";
})(eOptimismNetwork = exports.eOptimismNetwork || (exports.eOptimismNetwork = {}));
var eEthereumNetwork;
(function (eEthereumNetwork) {
    eEthereumNetwork["buidlerevm"] = "buidlerevm";
    eEthereumNetwork["kovan"] = "kovan";
    eEthereumNetwork["ropsten"] = "ropsten";
    eEthereumNetwork["main"] = "main";
    eEthereumNetwork["coverage"] = "coverage";
    eEthereumNetwork["hardhat"] = "hardhat";
    eEthereumNetwork["tenderly"] = "tenderly";
    eEthereumNetwork["rinkeby"] = "rinkeby";
    eEthereumNetwork["goerli"] = "goerli";
})(eEthereumNetwork = exports.eEthereumNetwork || (exports.eEthereumNetwork = {}));
var ePolygonNetwork;
(function (ePolygonNetwork) {
    ePolygonNetwork["polygon"] = "polygon";
    ePolygonNetwork["mumbai"] = "mumbai";
})(ePolygonNetwork = exports.ePolygonNetwork || (exports.ePolygonNetwork = {}));
var eXDaiNetwork;
(function (eXDaiNetwork) {
    eXDaiNetwork["xdai"] = "xdai";
})(eXDaiNetwork = exports.eXDaiNetwork || (exports.eXDaiNetwork = {}));
var eAvalancheNetwork;
(function (eAvalancheNetwork) {
    eAvalancheNetwork["avalanche"] = "avalanche";
    eAvalancheNetwork["fuji"] = "fuji";
})(eAvalancheNetwork = exports.eAvalancheNetwork || (exports.eAvalancheNetwork = {}));
var eArbitrumNetwork;
(function (eArbitrumNetwork) {
    eArbitrumNetwork["arbitrum"] = "arbitrum";
    eArbitrumNetwork["arbitrumTestnet"] = "arbitrum-testnet";
    eArbitrumNetwork["goerliNitro"] = "arbitrum-goerli";
})(eArbitrumNetwork = exports.eArbitrumNetwork || (exports.eArbitrumNetwork = {}));
var eHarmonyNetwork;
(function (eHarmonyNetwork) {
    eHarmonyNetwork["main"] = "harmony";
    eHarmonyNetwork["testnet"] = "harmony-testnet";
})(eHarmonyNetwork = exports.eHarmonyNetwork || (exports.eHarmonyNetwork = {}));
var EthereumNetworkNames;
(function (EthereumNetworkNames) {
    EthereumNetworkNames["kovan"] = "kovan";
    EthereumNetworkNames["ropsten"] = "ropsten";
    EthereumNetworkNames["main"] = "main";
    EthereumNetworkNames["matic"] = "matic";
    EthereumNetworkNames["mumbai"] = "mumbai";
    EthereumNetworkNames["xdai"] = "xdai";
    EthereumNetworkNames["avalanche"] = "avalanche";
    EthereumNetworkNames["fuji"] = "fuji";
})(EthereumNetworkNames = exports.EthereumNetworkNames || (exports.EthereumNetworkNames = {}));
var AavePools;
(function (AavePools) {
    AavePools["proto"] = "proto";
    AavePools["matic"] = "matic";
    AavePools["amm"] = "amm";
    AavePools["avalanche"] = "avalanche";
})(AavePools = exports.AavePools || (exports.AavePools = {}));
var eContractid;
(function (eContractid) {
    eContractid["Example"] = "Example";
    eContractid["PoolAddressesProvider"] = "PoolAddressesProvider";
    eContractid["MintableERC20"] = "MintableERC20";
    eContractid["MintableDelegationERC20"] = "MintableDelegationERC20";
    eContractid["PoolAddressesProviderRegistry"] = "PoolAddressesProviderRegistry";
    eContractid["PoolConfigurator"] = "PoolConfigurator";
    eContractid["ValidationLogic"] = "ValidationLogic";
    eContractid["ReserveLogic"] = "ReserveLogic";
    eContractid["GenericLogic"] = "GenericLogic";
    eContractid["Pool"] = "Pool";
    eContractid["PriceOracle"] = "PriceOracle";
    eContractid["Proxy"] = "Proxy";
    eContractid["MockAggregator"] = "MockAggregator";
    eContractid["AaveOracle"] = "AaveOracle";
    eContractid["DefaultReserveInterestRateStrategy"] = "DefaultReserveInterestRateStrategy";
    eContractid["LendingPoolCollateralManager"] = "LendingPoolCollateralManager";
    eContractid["InitializableAdminUpgradeabilityProxy"] = "InitializableAdminUpgradeabilityProxy";
    eContractid["MockFlashLoanReceiver"] = "MockFlashLoanReceiver";
    eContractid["WalletBalanceProvider"] = "WalletBalanceProvider";
    eContractid["AToken"] = "AToken";
    eContractid["MockAToken"] = "MockAToken";
    eContractid["DelegationAwareAToken"] = "DelegationAwareAToken";
    eContractid["MockStableDebtToken"] = "MockStableDebtToken";
    eContractid["MockVariableDebtToken"] = "MockVariableDebtToken";
    eContractid["AaveProtocolDataProvider"] = "AaveProtocolDataProvider";
    eContractid["IERC20Detailed"] = "IERC20Detailed";
    eContractid["StableDebtToken"] = "StableDebtToken";
    eContractid["VariableDebtToken"] = "VariableDebtToken";
    eContractid["FeeProvider"] = "FeeProvider";
    eContractid["TokenDistributor"] = "TokenDistributor";
    eContractid["StableAndVariableTokensHelper"] = "StableAndVariableTokensHelper";
    eContractid["ATokensAndRatesHelper"] = "ATokensAndRatesHelper";
    eContractid["UiPoolDataProviderV3"] = "UiPoolDataProviderV3";
    eContractid["WrappedTokenGatewayV3"] = "WrappedTokenGatewayV3";
    eContractid["WETH"] = "WETH";
})(eContractid = exports.eContractid || (exports.eContractid = {}));
/*
 * Error messages prefix glossary:
 *  - VL = ValidationLogic
 *  - MATH = Math libraries
 *  - AT = aToken or DebtTokens
 *  - LP = LendingPool
 *  - LPAPR = LendingPoolAddressesProviderRegistry
 *  - LPC = LendingPoolConfiguration
 *  - RL = ReserveLogic
 *  - LPCM = LendingPoolCollateralManager
 *  - P = Pausable
 */
var ProtocolErrors;
(function (ProtocolErrors) {
    //common errors
    ProtocolErrors["CALLER_NOT_POOL_ADMIN"] = "33";
    //contract specific errors
    ProtocolErrors["VL_INVALID_AMOUNT"] = "1";
    ProtocolErrors["VL_NO_ACTIVE_RESERVE"] = "2";
    ProtocolErrors["VL_RESERVE_FROZEN"] = "3";
    ProtocolErrors["VL_CURRENT_AVAILABLE_LIQUIDITY_NOT_ENOUGH"] = "4";
    ProtocolErrors["VL_NOT_ENOUGH_AVAILABLE_USER_BALANCE"] = "5";
    ProtocolErrors["VL_TRANSFER_NOT_ALLOWED"] = "6";
    ProtocolErrors["VL_BORROWING_NOT_ENABLED"] = "7";
    ProtocolErrors["VL_INVALID_INTEREST_RATE_MODE_SELECTED"] = "8";
    ProtocolErrors["VL_COLLATERAL_BALANCE_IS_0"] = "9";
    ProtocolErrors["VL_HEALTH_FACTOR_LOWER_THAN_LIQUIDATION_THRESHOLD"] = "10";
    ProtocolErrors["VL_COLLATERAL_CANNOT_COVER_NEW_BORROW"] = "11";
    ProtocolErrors["VL_STABLE_BORROWING_NOT_ENABLED"] = "12";
    ProtocolErrors["VL_COLLATERAL_SAME_AS_BORROWING_CURRENCY"] = "13";
    ProtocolErrors["VL_AMOUNT_BIGGER_THAN_MAX_LOAN_SIZE_STABLE"] = "14";
    ProtocolErrors["VL_NO_DEBT_OF_SELECTED_TYPE"] = "15";
    ProtocolErrors["VL_NO_EXPLICIT_AMOUNT_TO_REPAY_ON_BEHALF"] = "16";
    ProtocolErrors["VL_NO_STABLE_RATE_LOAN_IN_RESERVE"] = "17";
    ProtocolErrors["VL_NO_VARIABLE_RATE_LOAN_IN_RESERVE"] = "18";
    ProtocolErrors["VL_UNDERLYING_BALANCE_NOT_GREATER_THAN_0"] = "19";
    ProtocolErrors["VL_DEPOSIT_ALREADY_IN_USE"] = "20";
    ProtocolErrors["LP_NOT_ENOUGH_STABLE_BORROW_BALANCE"] = "21";
    ProtocolErrors["LP_INTEREST_RATE_REBALANCE_CONDITIONS_NOT_MET"] = "22";
    ProtocolErrors["LP_LIQUIDATION_CALL_FAILED"] = "23";
    ProtocolErrors["LP_NOT_ENOUGH_LIQUIDITY_TO_BORROW"] = "24";
    ProtocolErrors["LP_REQUESTED_AMOUNT_TOO_SMALL"] = "25";
    ProtocolErrors["LP_INCONSISTENT_PROTOCOL_ACTUAL_BALANCE"] = "26";
    ProtocolErrors["LP_CALLER_NOT_LENDING_POOL_CONFIGURATOR"] = "27";
    ProtocolErrors["LP_INCONSISTENT_FLASHLOAN_PARAMS"] = "28";
    ProtocolErrors["CT_CALLER_MUST_BE_LENDING_POOL"] = "29";
    ProtocolErrors["CT_CANNOT_GIVE_ALLOWANCE_TO_HIMSELF"] = "30";
    ProtocolErrors["CT_TRANSFER_AMOUNT_NOT_GT_0"] = "31";
    ProtocolErrors["RL_RESERVE_ALREADY_INITIALIZED"] = "32";
    ProtocolErrors["LPC_RESERVE_LIQUIDITY_NOT_0"] = "34";
    ProtocolErrors["LPC_INVALID_ATOKEN_POOL_ADDRESS"] = "35";
    ProtocolErrors["LPC_INVALID_STABLE_DEBT_TOKEN_POOL_ADDRESS"] = "36";
    ProtocolErrors["LPC_INVALID_VARIABLE_DEBT_TOKEN_POOL_ADDRESS"] = "37";
    ProtocolErrors["LPC_INVALID_STABLE_DEBT_TOKEN_UNDERLYING_ADDRESS"] = "38";
    ProtocolErrors["LPC_INVALID_VARIABLE_DEBT_TOKEN_UNDERLYING_ADDRESS"] = "39";
    ProtocolErrors["LPC_INVALID_ADDRESSES_PROVIDER_ID"] = "40";
    ProtocolErrors["LPC_CALLER_NOT_EMERGENCY_ADMIN"] = "76";
    ProtocolErrors["LPAPR_PROVIDER_NOT_REGISTERED"] = "41";
    ProtocolErrors["LPCM_HEALTH_FACTOR_NOT_BELOW_THRESHOLD"] = "42";
    ProtocolErrors["LPCM_COLLATERAL_CANNOT_BE_LIQUIDATED"] = "43";
    ProtocolErrors["LPCM_SPECIFIED_CURRENCY_NOT_BORROWED_BY_USER"] = "44";
    ProtocolErrors["LPCM_NOT_ENOUGH_LIQUIDITY_TO_LIQUIDATE"] = "45";
    ProtocolErrors["LPCM_NO_ERRORS"] = "46";
    ProtocolErrors["LP_INVALID_FLASHLOAN_MODE"] = "47";
    ProtocolErrors["MATH_MULTIPLICATION_OVERFLOW"] = "48";
    ProtocolErrors["MATH_ADDITION_OVERFLOW"] = "49";
    ProtocolErrors["MATH_DIVISION_BY_ZERO"] = "50";
    ProtocolErrors["RL_LIQUIDITY_INDEX_OVERFLOW"] = "51";
    ProtocolErrors["RL_VARIABLE_BORROW_INDEX_OVERFLOW"] = "52";
    ProtocolErrors["RL_LIQUIDITY_RATE_OVERFLOW"] = "53";
    ProtocolErrors["RL_VARIABLE_BORROW_RATE_OVERFLOW"] = "54";
    ProtocolErrors["RL_STABLE_BORROW_RATE_OVERFLOW"] = "55";
    ProtocolErrors["CT_INVALID_MINT_AMOUNT"] = "56";
    ProtocolErrors["LP_FAILED_REPAY_WITH_COLLATERAL"] = "57";
    ProtocolErrors["CT_INVALID_BURN_AMOUNT"] = "58";
    ProtocolErrors["LP_BORROW_ALLOWANCE_NOT_ENOUGH"] = "59";
    ProtocolErrors["LP_FAILED_COLLATERAL_SWAP"] = "60";
    ProtocolErrors["LP_INVALID_EQUAL_ASSETS_TO_SWAP"] = "61";
    ProtocolErrors["LP_REENTRANCY_NOT_ALLOWED"] = "62";
    ProtocolErrors["LP_CALLER_MUST_BE_AN_ATOKEN"] = "63";
    ProtocolErrors["LP_IS_PAUSED"] = "64";
    ProtocolErrors["LP_NO_MORE_RESERVES_ALLOWED"] = "65";
    ProtocolErrors["LP_INVALID_FLASH_LOAN_EXECUTOR_RETURN"] = "66";
    ProtocolErrors["RC_INVALID_LTV"] = "67";
    ProtocolErrors["RC_INVALID_LIQ_THRESHOLD"] = "68";
    ProtocolErrors["RC_INVALID_LIQ_BONUS"] = "69";
    ProtocolErrors["RC_INVALID_DECIMALS"] = "70";
    ProtocolErrors["RC_INVALID_RESERVE_FACTOR"] = "71";
    ProtocolErrors["LPAPR_INVALID_ADDRESSES_PROVIDER_ID"] = "72";
    // old
    ProtocolErrors["INVALID_FROM_BALANCE_AFTER_TRANSFER"] = "Invalid from balance after transfer";
    ProtocolErrors["INVALID_TO_BALANCE_AFTER_TRANSFER"] = "Invalid from balance after transfer";
    ProtocolErrors["INVALID_OWNER_REVERT_MSG"] = "Ownable: caller is not the owner";
    ProtocolErrors["INVALID_HF"] = "Invalid health factor";
    ProtocolErrors["TRANSFER_AMOUNT_EXCEEDS_BALANCE"] = "ERC20: transfer amount exceeds balance";
    ProtocolErrors["SAFEERC20_LOWLEVEL_CALL"] = "SafeERC20: low-level call failed";
})(ProtocolErrors = exports.ProtocolErrors || (exports.ProtocolErrors = {}));
var TokenContractId;
(function (TokenContractId) {
    TokenContractId["DAI"] = "DAI";
    TokenContractId["AAVE"] = "AAVE";
    TokenContractId["TUSD"] = "TUSD";
    TokenContractId["BAT"] = "BAT";
    TokenContractId["WETH"] = "WETH";
    TokenContractId["USDC"] = "USDC";
    TokenContractId["USDT"] = "USDT";
    TokenContractId["SUSD"] = "SUSD";
    TokenContractId["ZRX"] = "ZRX";
    TokenContractId["MKR"] = "MKR";
    TokenContractId["WBTC"] = "WBTC";
    TokenContractId["LINK"] = "LINK";
    TokenContractId["KNC"] = "KNC";
    TokenContractId["MANA"] = "MANA";
    TokenContractId["REN"] = "REN";
    TokenContractId["SNX"] = "SNX";
    TokenContractId["BUSD"] = "BUSD";
    TokenContractId["USD"] = "USD";
    TokenContractId["YFI"] = "YFI";
    TokenContractId["UNI"] = "UNI";
    TokenContractId["ENJ"] = "ENJ";
    TokenContractId["UniDAIWETH"] = "UniDAIWETH";
    TokenContractId["UniWBTCWETH"] = "UniWBTCWETH";
    TokenContractId["UniAAVEWETH"] = "UniAAVEWETH";
    TokenContractId["UniBATWETH"] = "UniBATWETH";
    TokenContractId["UniDAIUSDC"] = "UniDAIUSDC";
    TokenContractId["UniCRVWETH"] = "UniCRVWETH";
    TokenContractId["UniLINKWETH"] = "UniLINKWETH";
    TokenContractId["UniMKRWETH"] = "UniMKRWETH";
    TokenContractId["UniRENWETH"] = "UniRENWETH";
    TokenContractId["UniSNXWETH"] = "UniSNXWETH";
    TokenContractId["UniUNIWETH"] = "UniUNIWETH";
    TokenContractId["UniUSDCWETH"] = "UniUSDCWETH";
    TokenContractId["UniWBTCUSDC"] = "UniWBTCUSDC";
    TokenContractId["UniYFIWETH"] = "UniYFIWETH";
    TokenContractId["BptWBTCWETH"] = "BptWBTCWETH";
    TokenContractId["BptBALWETH"] = "BptBALWETH";
    TokenContractId["WMATIC"] = "WMATIC";
    TokenContractId["STAKE"] = "STAKE";
    TokenContractId["xSUSHI"] = "xSUSHI";
    TokenContractId["AVAX"] = "AVAX";
})(TokenContractId = exports.TokenContractId || (exports.TokenContractId = {}));
var RateMode;
(function (RateMode) {
    RateMode["None"] = "0";
    RateMode["Stable"] = "1";
    RateMode["Variable"] = "2";
})(RateMode = exports.RateMode || (exports.RateMode = {}));
var AssetType;
(function (AssetType) {
    AssetType[AssetType["AToken"] = 0] = "AToken";
    AssetType[AssetType["VariableDebtToken"] = 1] = "VariableDebtToken";
    AssetType[AssetType["StableDebtToken"] = 2] = "StableDebtToken";
})(AssetType = exports.AssetType || (exports.AssetType = {}));
var TransferStrategy;
(function (TransferStrategy) {
    TransferStrategy[TransferStrategy["PullRewardsStrategy"] = 0] = "PullRewardsStrategy";
    TransferStrategy[TransferStrategy["StakedRewardsStrategy"] = 1] = "StakedRewardsStrategy";
})(TransferStrategy = exports.TransferStrategy || (exports.TransferStrategy = {}));
