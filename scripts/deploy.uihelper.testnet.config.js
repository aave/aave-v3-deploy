/** PM2 Config file */

/**
 * @deployment Deployment of UiPoolDataProvider UI helper
 * @description This config file allows to deploy UiPoolDataProvider contract at
 *              multiple networks and distributed in parallel processes.
 */

const commons = {
  script: "npx",
  args: "hardhat deploy-UiPoolDataProvider",
  restart_delay: 100000000000,
  autorestart: false,
};

module.exports = {
  apps: [
    {
      name: "rinkeby-testnet-ui-helper",
      env: {
        HARDHAT_NETWORK: "rinkeby",
      },
      ...commons,
    },
    {
      name: "kovan-testnet-ui-helper",
      env: {
        HARDHAT_NETWORK: "kovan",
      },
      ...commons,
    },
    {
      name: "mumbai-testnet-ui-helper",
      env: {
        HARDHAT_NETWORK: "mumbai",
      },
      ...commons,
    },
    {
      name: "arbitrum-rinkeby-testnet-ui-helper",
      env: {
        HARDHAT_NETWORK: "arbitrum-testnet",
      },
      ...commons,
    },
    {
      name: "harmony-testnet-ui-helper",
      env: {
        HARDHAT_NETWORK: "harmony-testnet",
      },
      ...commons,
    },
    {
      name: "fuji-testnet-ui-helper",
      env: {
        HARDHAT_NETWORK: "fuji",
      },
      ...commons,
    },
    {
      name: "fantom-testnet-ui-helper",
      env: {
        HARDHAT_NETWORK: "fantom-testnet",
      },
      ...commons,
    },
    {
      name: "optimism-testnet-ui-helper",
      env: {
        HARDHAT_NETWORK: "optimism-testnet",
      },
      ...commons,
    },
  ],
};
