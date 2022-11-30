import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { PoolAddressesProviderRegistry } from "../../typechain";
import { waitForTx } from "../../helpers/utilities/tx";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer, addressesProviderRegistryOwner } = await getNamedAccounts();

  const poolAddressesProviderRegistryArtifact = await deploy(
    "PoolAddressesProviderRegistry",
    {
      from: deployer,
      args: [deployer],
      ...COMMON_DEPLOY_PARAMS,
    }
  );

  const registryInstance = (
    (await hre.ethers.getContractAt(
      poolAddressesProviderRegistryArtifact.abi,
      poolAddressesProviderRegistryArtifact.address
    )) as PoolAddressesProviderRegistry
  ).connect(await hre.ethers.getSigner(deployer));

  await waitForTx(
    await registryInstance.transferOwnership(addressesProviderRegistryOwner)
  );

  deployments.log(
    `[Deployment] Transferred ownership of PoolAddressesProviderRegistry to: ${addressesProviderRegistryOwner} `
  );
  return true;
};

func.id = "PoolAddressesProviderRegistry";
func.tags = ["core", "registry"];

export default func;
