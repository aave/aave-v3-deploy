/** PM2 Config file */

/**
 * @deployment Full Aave V3 production in fork mode
 * @description This config file allows to deploy Aave V3 at
 *              multiple networks and distributed in parallel processes.
 */

const commons = {
  script: "npm",
  restart_delay: 100000000000,
  autorestart: false,
  env: {
    SKIP_COMPILE: "true",
    DETERMINISTIC_DEPLOYMENT: "true",
  },
};

module.exports = {
  apps: [
    {
      name: "eth-fork-v3",
      args: "run deploy:market:aave:fork",
      ...commons,
    },
    {
      name: "optimism-fork-v3",
      args: "run deploy:market:aave:optimism:fork",
      ...commons,
    },
    {
      name: "arbitrum-fork-v3",
      args: "run deploy:market:aave:arbitrum:fork",
      ...commons,
    },
    {
      name: "harmony-fork-v3",
      args: "run deploy:market:harmony:fork",
      ...commons,
    },
    {
      name: "avalanche-fork-testnet-v3",
      args: "run deploy:market:avalanche:fork",
      ...commons,
    },
    {
      name: "fantom-fork-v3",
      args: "run deploy:market:fantom:fork",
      ...commons,
    },
    {
      name: "polygon-fork-testnet-v3",
      args: "run deploy:market:polygon:fork",
      ...commons,
    },
  ],
};
