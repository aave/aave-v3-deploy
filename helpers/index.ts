export * from "./constants";
export * from "./contract-deployments";
export * from "./contract-getters";
export * from "./deploy-ids";
export * from "./hardhat-config-helpers";
export * from "./init-helpers";
export * from "./market-config-helpers";
export * from "./types";
export * from "./utilities/defender";
export * from "./utilities/fork";
export * from "./utilities/tx";
export * from "./utilities/utils";
export * from "./utilities/signer";
export * from "../markets/aave/commons";
export * from "../markets/aave/rateStrategies";
export * from "../markets/aave/reservesConfigs";
export * from "../tasks/market-registry/market-registry-add";
export * from "../tasks/misc/deploy-ui-helpers";
export * from "../tasks/misc/deploy-UiIncentiveDataProvider";
export * from "../tasks/misc/deploy-UiPoolDataProvider";
export * from "../tasks/misc/faucet";
export * from "../tasks/misc/print-deployments";
export * from "../tasks/misc/renounce-pool-admin";
export * from "../tasks/misc/review-atokens";
export * from "../tasks/misc/review-e-mode";
export * from "../tasks/misc/review-rate-strategies";
export * from "../tasks/misc/review-stable-borrow";
export * from "../tasks/misc/review-supply-caps";
export * from "../tasks/misc/set-fallback-oracle";
export * from "../tasks/misc/setup-debt-ceiling";
export * from "../tasks/misc/setup-e-modes";
export * from "../tasks/misc/setup-isolation-mode";
export * from "../tasks/misc/setup-liquidation-protocol-fee";
export * from "../tasks/misc/transfer-ownership";
export * from "../tasks/misc/transfer-protocol-ownership";
export * from "../tasks/misc/upgrade-atokens-and-review";
export * from "../tasks/misc/upgrade-atokens";
export * from "../tasks/misc/verify-tokens";
export * from "../tasks/misc/view-protocol-roles";
export * from "../typechain";

import { loadTasks } from "./hardhat-config-helpers";

/** Hardhat Plugin to export tasks in other projects. */

const TASK_FOLDERS = ["../tasks/misc", "../tasks/market-registry"];

// Load all plugin tasks
loadTasks(TASK_FOLDERS);
