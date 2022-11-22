/** PM2 Config file */

/**
 * @deployment Full Aave V3 testnet deployment in fork mode
 * @description This config file allows to deploy Aave V3 at
 *              multiple networks and distributed in parallel processes.
 */

const commons = {
  script: "npm",
  restart_delay: 100000000000,
  autorestart: false,
  env: {
    SKIP_COMPILE: "true",
  },
};

module.exports = {
  apps: [
    {
      name: "rinkeby-testnet-v3",
      args: "run deploy:market:aave:rinkeby",
      ...commons,
    },
    {
      name: "kovan-testnet-v3",
      args: "run deploy:market:aave:kovan",
      ...commons,
    },
    {
      name: "optimism-testnet-v3",
      args: "run deploy:market:aave:optimism-test",
      ...commons,
    },
    {
      name: "arbitrum-testnet-v3",
      args: "run deploy:market:aave:arbitrum-test",
      ...commons,
    },
    {
      name: "harmony-testnet-v3",
      args: "run deploy:market:harmony:test",
      ...commons,
    },
    {
      name: "avalanche-fuji-testnet-v3",
      args: "run deploy:market:avalanche:test",
      ...commons,
    },
    {
      name: "fantom-testnet-v3",
      args: "run deploy:market:fantom:test",
      ...commons,
    },
    {
      name: "polygon-mumbai-testnet-v3",
      args: "run deploy:market:polygon:test",
      ...commons,
    },
  ],
};
