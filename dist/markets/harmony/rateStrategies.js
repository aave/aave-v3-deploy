"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateStrategyDebtPrevention = void 0;
const utils_1 = require("ethers/lib/utils");
exports.rateStrategyDebtPrevention = {
    name: "rateStrategyVolatileOne",
    optimalUsageRatio: (0, utils_1.parseUnits)("0.45", 27).toString(),
    baseVariableBorrowRate: "0",
    variableRateSlope1: (0, utils_1.parseUnits)("0", 27).toString(),
    variableRateSlope2: (0, utils_1.parseUnits)("0.03", 27).toString(),
    stableRateSlope1: (0, utils_1.parseUnits)("0", 27).toString(),
    stableRateSlope2: (0, utils_1.parseUnits)("0.03", 27).toString(),
    baseStableRateOffset: (0, utils_1.parseUnits)("0.01", 27).toString(),
    stableRateExcessOffset: (0, utils_1.parseUnits)("0.01", 27).toString(),
    optimalStableToTotalDebtRatio: (0, utils_1.parseUnits)("0.2", 27).toString(),
};
