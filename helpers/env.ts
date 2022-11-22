import { ConfigNames } from "./market-config-helpers";
export let { MARKET_NAME }: { MARKET_NAME: ConfigNames } = process.env as any;

MARKET_NAME = MARKET_NAME ? MARKET_NAME : ConfigNames.Commons;

export const ENABLE_REWARDS = process.env.ENABLE_REWARDS
  ? process.env.ENABLE_REWARDS === "true"
  : undefined;

export const DETERMINISTIC_DEPLOYMENT = process.env.DETERMINISTIC_DEPLOYMENT
  ? process.env.DETERMINISTIC_DEPLOYMENT === "true"
  : null;

export const COMMON_DEPLOY_PARAMS = {
  log: true,
  deterministicDeployment: DETERMINISTIC_DEPLOYMENT ?? false,
};
