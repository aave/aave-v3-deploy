/** PM2 Config file */

/**
 * @deployment Full Aave V3 production in main mode
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
      name: "optimism-main-v3",
      args: "run deploy:market:aave:optimism",
      ...commons,
    },
    {
      name: "arbitrum-main-v3",
      args: "run deploy:market:aave:arbitrum",
      ...commons,
    },
    {
      name: "harmony-main-v3",
      args: "run deploy:market:harmony:main",
      ...commons,
    },
    {
      name: "avalanche-main-v3",
      args: "run deploy:market:avalanche:main",
      ...commons,
    },
    {
      name: "fantom-main-v3",
      args: "run deploy:market:fantom:main",
      ...commons,
    },
    {
      name: "polygon-main-v3",
      args: "run deploy:market:polygon:main",
      ...commons,
    },
  ],
};
