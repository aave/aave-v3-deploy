import { rateStrategyStableOne } from "./../aave/rateStrategies";
import { eContractid, IReserveParams } from "../../helpers/types";

export const strategySUSD: IReserveParams = {
  strategy: rateStrategyStableOne,
  baseLTVAsCollateral: "0",
  liquidationThreshold: "0",
  liquidationBonus: "0",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  flashLoanEnabled: true,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "2000000000",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: false,
};
