import { ZERO_ADDRESS } from "./../../helpers/constants";
import { getPoolConfiguratorProxy } from "./../../helpers/contract-getters";
import { L2_POOL_IMPL_ID } from "./../../helpers/deploy-ids";
import {
  ConfigNames,
  isL2PoolSupported,
  loadPoolConfig,
} from "./../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { V3_CORE_VERSION } from "../../helpers/constants";
import { checkRequiredEnvironment } from "../../helpers/market-config-helpers";
import {
  L2_ENCODER,
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_CONFIGURATOR_IMPL_ID,
  POOL_CONFIGURATOR_PROXY_ID,
  POOL_IMPL_ID,
  POOL_PROXY_ID,
} from "../../helpers/deploy-ids";
import { PoolAddressesProvider } from "../../typechain";
import { getContract, waitForTx } from "../../helpers/utilities/tx";
import { MARKET_NAME } from "../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { save, deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const proxyArtifact = await deployments.getExtendedArtifact(
    "InitializableImmutableAdminUpgradeabilityProxy"
  );

  const poolImplDeployment = isL2PoolSupported(poolConfig)
    ? await deployments.get(L2_POOL_IMPL_ID)
    : await deployments.get(POOL_IMPL_ID);

  const poolConfiguratorImplDeployment = await deployments.get(
    POOL_CONFIGURATOR_IMPL_ID
  );

  const { address: addressesProvider } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  const addressesProviderInstance = (
    await getContract("PoolAddressesProvider", addressesProvider)
  ).connect(await hre.ethers.getSigner(deployer)) as PoolAddressesProvider;

  const isPoolProxyPending =
    (await addressesProviderInstance.getPool()) === ZERO_ADDRESS;

  // Set Pool implementation to Addresses provider and save the proxy deployment artifact at disk
  if (isPoolProxyPending) {
    const setPoolImplTx = await waitForTx(
      await addressesProviderInstance.setPoolImpl(poolImplDeployment.address)
    );
    const txPoolProxyAddress = await addressesProviderInstance.getPool();
    deployments.log(
      `[Deployment] Attached Pool implementation and deployed proxy contract: `
    );
    deployments.log("- Tx hash:", setPoolImplTx.transactionHash);
  }

  const poolProxyAddress = await addressesProviderInstance.getPool();
  deployments.log("- Deployed Proxy:", poolProxyAddress);

  await save(POOL_PROXY_ID, {
    ...proxyArtifact,
    address: poolProxyAddress,
  });
  const isPoolConfiguratorProxyPending =
    (await addressesProviderInstance.getPoolConfigurator()) === ZERO_ADDRESS;

  // Set Pool Configurator to Addresses Provider proxy deployment artifact at disk
  if (isPoolConfiguratorProxyPending) {
    const setPoolConfiguratorTx = await waitForTx(
      await addressesProviderInstance.setPoolConfiguratorImpl(
        poolConfiguratorImplDeployment.address
      )
    );
    deployments.log(
      `[Deployment] Attached PoolConfigurator implementation and deployed proxy `
    );
    deployments.log("- Tx hash:", setPoolConfiguratorTx.transactionHash);
  }
  const poolConfiguratorProxyAddress =
    await addressesProviderInstance.getPoolConfigurator();

  deployments.log("- Deployed Proxy:", poolConfiguratorProxyAddress);

  await save(POOL_CONFIGURATOR_PROXY_ID, {
    ...proxyArtifact,
    address: poolConfiguratorProxyAddress,
  });

  if (isL2PoolSupported(poolConfig)) {
    // Deploy L2 Encoder
    await deploy(L2_ENCODER, {
      from: deployer,
      contract: "L2Encoder",
      args: [poolProxyAddress],
      ...COMMON_DEPLOY_PARAMS,
    });
  }

  // Set Flash Loan premiums
  const poolConfiguratorInstance = (await getPoolConfiguratorProxy()).connect(
    await hre.ethers.getSigner(deployer)
  );

  // Set total Flash Loan Premium
  await waitForTx(
    await poolConfiguratorInstance.updateFlashloanPremiumTotal(
      poolConfig.FlashLoanPremiums.total
    )
  );
  // Set protocol Flash Loan Premium
  await waitForTx(
    await poolConfiguratorInstance.updateFlashloanPremiumToProtocol(
      poolConfig.FlashLoanPremiums.protocol
    )
  );

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `PoolInitalization:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "init-pool"];
func.dependencies = ["before-deploy", "core", "periphery-pre", "provider"];

func.skip = async () => checkRequiredEnvironment();

export default func;
