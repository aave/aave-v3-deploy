"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strategySUSD = void 0;
const rateStrategies_1 = require("./../aave/rateStrategies");
const types_1 = require("../../helpers/types");
exports.strategySUSD = {
    strategy: rateStrategies_1.rateStrategyStableOne,
    baseLTVAsCollateral: "0",
    liquidationThreshold: "0",
    liquidationBonus: "0",
    liquidationProtocolFee: "1000",
    borrowingEnabled: true,
    stableBorrowRateEnabled: false,
    flashLoanEnabled: true,
    reserveDecimals: "18",
    aTokenImpl: types_1.eContractid.AToken,
    reserveFactor: "1000",
    supplyCap: "2000000000",
    borrowCap: "0",
    debtCeiling: "0",
    borrowableIsolation: false,
};
