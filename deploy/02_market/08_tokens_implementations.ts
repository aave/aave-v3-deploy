import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  ATOKEN_IMPL_ID,
  DELEGATION_AWARE_ATOKEN_IMPL_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  STABLE_DEBT_TOKEN_IMPL_ID,
  VARIABLE_DEBT_TOKEN_IMPL_ID,
} from "../../helpers/deploy-ids";
import {
  AToken,
  DelegationAwareAToken,
  PoolAddressesProvider,
  StableDebtToken,
  VariableDebtToken,
} from "../../typechain";
import { V3_CORE_VERSION, ZERO_ADDRESS } from "../../helpers/constants";
import { getContract, waitForTx } from "../../helpers";
import { MARKET_NAME } from "../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const { address: addressesProvider } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  const addressesProviderInstance = (await getContract(
    "PoolAddressesProvider",
    addressesProvider
  )) as PoolAddressesProvider;

  const poolAddress = await addressesProviderInstance.getPool();

  const aTokenArtifact = await deploy(ATOKEN_IMPL_ID, {
    contract: "AToken",
    from: deployer,
    args: [poolAddress],
    ...COMMON_DEPLOY_PARAMS,
  });

  const aToken = (await hre.ethers.getContractAt(
    aTokenArtifact.abi,
    aTokenArtifact.address
  )) as AToken;
  await waitForTx(
    await aToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // treasury
      ZERO_ADDRESS, // underlyingAsset
      ZERO_ADDRESS, // incentivesController
      0, // aTokenDecimals
      "ATOKEN_IMPL", // aTokenName
      "ATOKEN_IMPL", // aTokenSymbol
      "0x00" // params
    )
  );

  const delegationAwareATokenArtifact = await deploy(
    DELEGATION_AWARE_ATOKEN_IMPL_ID,
    {
      contract: "DelegationAwareAToken",
      from: deployer,
      args: [poolAddress],
      ...COMMON_DEPLOY_PARAMS,
    }
  );

  const delegationAwareAToken = (await hre.ethers.getContractAt(
    delegationAwareATokenArtifact.abi,
    delegationAwareATokenArtifact.address
  )) as DelegationAwareAToken;
  await waitForTx(
    await delegationAwareAToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // treasury
      ZERO_ADDRESS, // underlyingAsset
      ZERO_ADDRESS, // incentivesController
      0, // aTokenDecimals
      "DELEGATION_AWARE_ATOKEN_IMPL", // aTokenName
      "DELEGATION_AWARE_ATOKEN_IMPL", // aTokenSymbol
      "0x00" // params
    )
  );

  const stableDebtTokenArtifact = await deploy(STABLE_DEBT_TOKEN_IMPL_ID, {
    contract: "StableDebtToken",
    from: deployer,
    args: [poolAddress],
    ...COMMON_DEPLOY_PARAMS,
  });

  const stableDebtToken = (await hre.ethers.getContractAt(
    stableDebtTokenArtifact.abi,
    stableDebtTokenArtifact.address
  )) as StableDebtToken;
  await waitForTx(
    await stableDebtToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // underlyingAsset
      ZERO_ADDRESS, // incentivesController
      0, // debtTokenDecimals
      "STABLE_DEBT_TOKEN_IMPL", // debtTokenName
      "STABLE_DEBT_TOKEN_IMPL", // debtTokenSymbol
      "0x00" // params
    )
  );

  const variableDebtTokenArtifact = await deploy(VARIABLE_DEBT_TOKEN_IMPL_ID, {
    contract: "VariableDebtToken",
    from: deployer,
    args: [poolAddress],
    ...COMMON_DEPLOY_PARAMS,
  });

  const variableDebtToken = (await hre.ethers.getContractAt(
    variableDebtTokenArtifact.abi,
    variableDebtTokenArtifact.address
  )) as VariableDebtToken;
  await waitForTx(
    await variableDebtToken.initialize(
      poolAddress, // initializingPool
      ZERO_ADDRESS, // underlyingAsset
      ZERO_ADDRESS, // incentivesController
      0, // debtTokenDecimals
      "VARIABLE_DEBT_TOKEN_IMPL", // debtTokenName
      "VARIABLE_DEBT_TOKEN_IMPL", // debtTokenSymbol
      "0x00" // params
    )
  );

  return true;
};

func.id = `TokenImplementations:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "tokens"];

export default func;
