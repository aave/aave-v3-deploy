import { parseUnits } from "ethers/lib/utils";
import { IInterestRateStrategyParams } from "../../helpers/types";

export const rateStrategyVolatileOne: IInterestRateStrategyParams = {
  name: "rateStrategyVolatileOne",
  optimalUsageRatio: parseUnits("0.45", 27).toString(),
  baseVariableBorrowRate: "0",
  variableRateSlope1: parseUnits("0.07", 27).toString(),
  variableRateSlope2: parseUnits("3", 27).toString(),
  stableRateSlope1: parseUnits("0.07", 27).toString(),
  stableRateSlope2: parseUnits("3", 27).toString(),
  baseStableRateOffset: parseUnits("0.02", 27).toString(),
  stableRateExcessOffset: parseUnits("0.05", 27).toString(),
  optimalStableToTotalDebtRatio: parseUnits("0.2", 27).toString(),
};
