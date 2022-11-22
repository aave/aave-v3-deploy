import { Signer } from "ethers";
import { tEthereumAddress } from "../types";
import { usingDefender, getDefenderRelaySigner } from "./defender";
import { HardhatRuntimeEnvironment } from "hardhat/types";

declare var hre: HardhatRuntimeEnvironment;

export const getEthersSigners = async (): Promise<Signer[]> => {
  const ethersSigners = await hre.ethers.getSigners();

  if (usingDefender()) {
    const [, ...users] = ethersSigners;
    return [await getDefenderRelaySigner(), ...users];
  }
  return ethersSigners;
};

export const getEthersSignersAddresses = async (): Promise<
  tEthereumAddress[]
> =>
  await Promise.all(
    (await getEthersSigners()).map((signer) => signer.getAddress())
  );

export const getFirstSigner = async () => (await getEthersSigners())[0];
