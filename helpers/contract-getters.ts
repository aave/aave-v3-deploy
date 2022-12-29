import { getFirstSigner } from "./utilities/signer";
import { StakedTokenTransferStrategy } from "./../typechain";
import { PullRewardsTransferStrategy } from "./../typechain";
import {
  AaveOracle,
  ACLManager,
  AToken,
  BorrowLogic,
  BridgeLogic,
  EModeLogic,
  FlashLoanLogic,
  IERC20Detailed,
  LiquidationLogic,
  MockInitializableImple,
  MockInitializableImpleV2,
  Pool,
  PoolAddressesProvider,
  PoolConfigurator,
  PriceOracle,
  StableDebtToken,
  SupplyLogic,
  VariableDebtToken,
  WETH9,
  WETH9Mocked,
  AaveProtocolDataProvider,
  MintableERC20,
  DefaultReserveInterestRateStrategy,
  MockFlashLoanReceiver,
  PoolAddressesProviderRegistry,
  ReservesSetupHelper,
  MockVariableDebtToken,
  MockStableDebtToken,
  MockPool,
  Faucet,
  WrappedTokenGatewayV3,
  UiPoolDataProviderV3,
  WalletBalanceProvider,
  UiIncentiveDataProviderV3,
} from "../typechain";
import { tEthereumAddress } from "./types";
import {
  POOL_ADDRESSES_PROVIDER_ID,
  ACL_MANAGER_ID,
  POOL_CONFIGURATOR_PROXY_ID,
  POOL_PROXY_ID,
  POOL_DATA_PROVIDER,
  ORACLE_ID,
  FALLBACK_ORACLE_ID,
  TESTNET_TOKEN_PREFIX,
  INCENTIVES_V2_IMPL_ID,
  INCENTIVES_PULL_REWARDS_STRATEGY_ID,
  INCENTIVES_PROXY_ID,
  INCENTIVES_STAKED_TOKEN_STRATEGY_ID,
  STAKE_AAVE_PROXY,
  STAKE_AAVE_IMPL_V3,
  L2_ENCODER,
  FAUCET_OWNABLE_ID,
} from "./deploy-ids";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { RewardsController } from "../typechain";
import { StakedTokenV2Rev3 } from "../typechain";
import { Libraries } from "hardhat-deploy/dist/types";
import { getContract } from "./utilities/tx";
import { EMISSION_MANAGER_ID } from ".";
import { EmissionManager } from "../typechain";

// Prevent error HH9 when importing this file inside tasks or helpers at Hardhat config load
declare var hre: HardhatRuntimeEnvironment;

export const getAToken = async (address: tEthereumAddress): Promise<AToken> =>
  getContract("AToken", address);

export const getVariableDebtToken = async (
  address: tEthereumAddress
): Promise<VariableDebtToken> => getContract("VariableDebtToken", address);

export const getStableDebtToken = async (
  address: tEthereumAddress
): Promise<StableDebtToken> => getContract("StableDebtToken", address);

export const getERC20 = async (
  address: tEthereumAddress
): Promise<IERC20Detailed> =>
  getContract(
    "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol:IERC20Detailed",
    address
  );

export const getWETH = async (address: tEthereumAddress): Promise<WETH9> =>
  getContract("WETH9", address);

export const getPoolAddressesProvider = async (
  address?: tEthereumAddress
): Promise<PoolAddressesProvider> =>
  getContract(
    "PoolAddressesProvider",
    address || (await hre.deployments.get(POOL_ADDRESSES_PROVIDER_ID)).address
  );

export const getACLManager = async (
  address?: tEthereumAddress
): Promise<ACLManager> =>
  getContract(
    "ACLManager",
    address || (await hre.deployments.get(ACL_MANAGER_ID)).address
  );

export const getPoolConfiguratorProxy = async (
  address?: tEthereumAddress
): Promise<PoolConfigurator> =>
  getContract(
    "PoolConfigurator",
    address || (await hre.deployments.get(POOL_CONFIGURATOR_PROXY_ID)).address
  );

export const getSupplyLogic = async (
  address?: tEthereumAddress
): Promise<SupplyLogic> => getContract("SupplyLogic", address);

export const getBridgeLogic = async (
  address?: tEthereumAddress
): Promise<BridgeLogic> => getContract("BridgeLogic", address);

export const getBorrowLogic = async (
  address?: tEthereumAddress
): Promise<BorrowLogic> => getContract("BorrowLogic", address);

export const getLiquidationLogic = async (
  address?: tEthereumAddress
): Promise<LiquidationLogic> => getContract("LiquidationLogic", address);

export const getEModeLogic = async (
  address?: tEthereumAddress
): Promise<EModeLogic> => getContract("EModeLogic", address);

export const getFlashLoanLogic = async (
  address?: tEthereumAddress
): Promise<FlashLoanLogic> => getContract("FlashLoanLogic", address);

export const getPool = async (address?: tEthereumAddress): Promise<Pool> =>
  getContract(
    "Pool",
    address || (await hre.deployments.get(POOL_PROXY_ID)).address
  );

export const getPriceOracle = async (
  address?: tEthereumAddress
): Promise<AaveOracle> => getContract("PriceOracle", address);

export const getIRStrategy = async (
  address: tEthereumAddress
): Promise<DefaultReserveInterestRateStrategy> =>
  getContract("DefaultReserveInterestRateStrategy", address);

export const getMintableERC20 = async (
  address: tEthereumAddress
): Promise<MintableERC20> => getContract("MintableERC20", address);

export const getIErc20Detailed = async (
  address: tEthereumAddress
): Promise<IERC20Detailed> =>
  getContract(
    "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol:IERC20Detailed",
    address
  );

export const getAaveProtocolDataProvider = async (
  address?: tEthereumAddress
): Promise<AaveProtocolDataProvider> =>
  getContract(
    "AaveProtocolDataProvider",
    address || (await hre.deployments.get(POOL_DATA_PROVIDER)).address
  );

export const getAaveOracle = async (
  address?: tEthereumAddress
): Promise<AaveOracle> =>
  getContract(
    "AaveOracle",
    address || (await hre.deployments.get(ORACLE_ID)).address
  );

export const getFallbackOracle = async (
  address?: tEthereumAddress
): Promise<PriceOracle> =>
  getContract(
    "PriceOracle",
    address || (await hre.deployments.get(FALLBACK_ORACLE_ID)).address
  );

export const getMockFlashLoanReceiver = async (
  address?: tEthereumAddress
): Promise<MockFlashLoanReceiver> =>
  getContract("MockFlashLoanReceiver", address);

export const getPoolAddressesProviderRegistry = async (
  address?: tEthereumAddress
): Promise<PoolAddressesProviderRegistry> =>
  getContract("PoolAddressesProviderRegistry", address);

export const getReservesSetupHelper = async (
  address?: tEthereumAddress
): Promise<ReservesSetupHelper> => getContract("ReservesSetupHelper", address);

export const getWETHMocked = async (
  address?: tEthereumAddress
): Promise<WETH9Mocked> => getContract("WETH9Mocked", address);

export const getMockVariableDebtToken = async (
  address: tEthereumAddress
): Promise<MockVariableDebtToken> =>
  getContract("MockVariableDebtToken", address);

export const getMockStableDebtToken = async (
  address: tEthereumAddress
): Promise<MockStableDebtToken> => getContract("MockStableDebtToken", address);

export const getMockPool = async (
  address?: tEthereumAddress
): Promise<MockPool> => getContract("MockPool", address);

export const getMockL2Pool = async (
  address?: tEthereumAddress
): Promise<MockPool> => getContract("MockL2Pool", address);

export const getMockInitializableImple = async (
  address?: tEthereumAddress
): Promise<MockInitializableImple> =>
  getContract("MockInitializableImple", address);

export const getMockInitializableImpleV2 = async (
  address?: tEthereumAddress
): Promise<MockInitializableImpleV2> =>
  getContract("MockInitializableImpleV2", address);

export const getPoolLibraries = async (): Promise<Libraries> => {
  const supplyLibraryArtifact = await hre.deployments.get("SupplyLogic");
  const borrowLibraryArtifact = await hre.deployments.get("BorrowLogic");
  const liquidationLibraryArtifact = await hre.deployments.get(
    "LiquidationLogic"
  );
  const eModeLibraryArtifact = await hre.deployments.get("EModeLogic");
  const bridgeLibraryArtifact = await hre.deployments.get("BridgeLogic");
  const flashLoanLogicArtifact = await hre.deployments.get("FlashLoanLogic");
  const poolLogicArtifact = await hre.deployments.get("PoolLogic");

  return {
    LiquidationLogic: liquidationLibraryArtifact.address,
    SupplyLogic: supplyLibraryArtifact.address,
    EModeLogic: eModeLibraryArtifact.address,
    FlashLoanLogic: flashLoanLogicArtifact.address,
    BorrowLogic: borrowLibraryArtifact.address,
    BridgeLogic: bridgeLibraryArtifact.address,
    PoolLogic: poolLogicArtifact.address,
  };
};

export const getTestnetReserveAddressFromSymbol = async (symbol: string) => {
  const testnetReserve = await hre.deployments.get(
    `${symbol}${TESTNET_TOKEN_PREFIX}`
  );
  return testnetReserve.address;
};

export const getFaucet = async (address?: string): Promise<Faucet> =>
  getContract(
    "Faucet",
    address || (await hre.deployments.get(FAUCET_OWNABLE_ID)).address
  );

export const getWrappedTokenGateway = async (
  address?: string
): Promise<WrappedTokenGatewayV3> => {
  return getContract("WrappedTokenGatewayV3", address);
};

export const getUiPoolDataProvider = async (
  address?: string
): Promise<UiPoolDataProviderV3> =>
  getContract("UiPoolDataProviderV3", address);

export const getUiIncentiveDataProvider = async (
  address?: string
): Promise<UiIncentiveDataProviderV3> =>
  getContract("UiIncentiveDataProviderV3", address);

export const getWalletBalanceProvider = async (
  address?: string
): Promise<WalletBalanceProvider> =>
  getContract("WalletBalanceProvider", address);

export const getIncentivesV2 = async (
  address?: string
): Promise<RewardsController> => {
  const artifactProxy = await hre.deployments.get(INCENTIVES_PROXY_ID);
  const artifactImpl = await hre.deployments.get(INCENTIVES_V2_IMPL_ID);
  return hre.ethers.getContractAt(
    artifactImpl.abi,
    address || artifactProxy.address
  ) as any as RewardsController;
};

export const getPullRewardsStrategy = async (
  address?: string
): Promise<PullRewardsTransferStrategy> =>
  getContract(
    "PullRewardsTransferStrategy",
    address ||
      (await hre.deployments.get(INCENTIVES_PULL_REWARDS_STRATEGY_ID)).address
  );

export const getStakedRewardsStrategy = async (
  address?: string
): Promise<StakedTokenTransferStrategy> =>
  getContract(
    "StakedTokenTransferStrategy",
    address ||
      (await hre.deployments.get(INCENTIVES_STAKED_TOKEN_STRATEGY_ID)).address
  );

export const getStakeAave = async (
  address?: string
): Promise<StakedTokenV2Rev3> => {
  const proxyArtifact = await hre.deployments.get(STAKE_AAVE_PROXY);
  const implArtifact = await hre.deployments.get(STAKE_AAVE_IMPL_V3);
  return hre.ethers.getContractAt(
    implArtifact.abi,
    address || proxyArtifact.address
  ) as any as StakedTokenV2Rev3;
};

export const getL2Encoder = async (address?: tEthereumAddress) =>
  getContract(
    "L2Encoder",
    address || (await hre.deployments.get(L2_ENCODER)).address
  );

export const getEmissionManager = async (address?: tEthereumAddress) =>
  getContract<EmissionManager>(
    "EmissionManager",
    address || (await hre.deployments.get(EMISSION_MANAGER_ID)).address
  );

export const getOwnableContract = async (address: string) => {
  const ownableInterface = new hre.ethers.utils.Interface([
    "function owner() public view returns (address)",
    "function transferOwnership(address newOwner) public",
    "function renounceOwnership() public",
  ]);

  return new hre.ethers.Contract(
    address,
    ownableInterface,
    await getFirstSigner()
  );
};
