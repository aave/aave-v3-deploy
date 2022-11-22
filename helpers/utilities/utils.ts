import { ZERO_ADDRESS } from "../constants";
import { getAddress, isAddress } from "ethers/lib/utils";
import { tEthereumAddress } from "../types";

export const isValidAddress = (value: tEthereumAddress): boolean =>
  !!value && isAddress(value) && getAddress(value) !== getAddress(ZERO_ADDRESS);

export const chunk = <T>(arr: Array<T>, chunkSize: number): Array<Array<T>> => {
  return arr.reduce(
    (prevVal: any, currVal: any, currIndx: number, array: Array<T>) =>
      !(currIndx % chunkSize)
        ? prevVal.concat([array.slice(currIndx, currIndx + chunkSize)])
        : prevVal,
    []
  );
};

export const filterMapBy = (
  raw: { [key: string]: any },
  fn: (key: string) => boolean
) =>
  Object.keys(raw)
    .filter(fn)
    .reduce<{ [key: string]: any }>((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});

export const isEqualAddress = (a: tEthereumAddress, b: tEthereumAddress) =>
  getAddress(a) === getAddress(b);

export const containsSameMembers = (arr1: any[], arr2: any[]) => {
  return arr1.sort().join(",") === arr2.sort().join(",");
};
