import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress, tEthereumAddress } from "../types";
import Bluebird from "bluebird";

declare var hre: HardhatRuntimeEnvironment;

export const impersonateAddress = async (
  address: tEthereumAddress
): Promise<SignerWithAddress> => {
  if (!usingTenderly()) {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [address],
    });
  }
  const signer = await hre.ethers.provider.getSigner(address);

  return {
    signer,
    address,
  };
};

export const impersonateAddresses = async (
  addresses: tEthereumAddress[]
): Promise<SignerWithAddress[]> => Bluebird.map(addresses, impersonateAddress);

export const usingTenderly = () =>
  (hre.network && hre.network.name.includes("tenderly")) ||
  process.env.TENDERLY === "true";
