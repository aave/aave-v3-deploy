# Aave V3 Deployments

This Node.js repository contains the configuration and deployment scripts for the Aave V3 protocol core and periphery contracts. The repository makes use of `hardhat` and `hardhat-deploy` tools to facilitate the deployment of Aave V3 protocol.

## Requirements

- Node.js >= 16
- Alchemy or Infura API key
  - If you use a custom RPC node, you can change the default RPC provider URL at [./helpers/hardhat-config-helpers.ts:25](./helpers/hardhat-config-helpers.ts).
- Etherscan API key _(Optional)_

## Getting Started

1. Install Node.JS dependencies:

   ```
   npm i
   ```

2. Compile contracts before running any other command, to generate Typechain TS typings:

   ```
   npm run compile
   ```

3. Create a `.env` configuration file at the root of the repository

   ```
   touch .env
   ```

4. Fill the `.env` configuration file with the following environment variables

   ```
   # To deploy a Market, you need to indicate the Market name at MARKET_NAME. By default is the "Aave" market.
   MARKET_NAME=Aave

   # Your RPC keys, required for deployment of live networks or forks
   ALCHEMY_KEY=***

   # Your mnemonic seed phrase to derive wallets
   MNEMONIC=***

   # Optional, your Etherscan API key to verify contracts
   ETHERSCAN_API_KEY=***
   ```

5. Run the deployment scripts in Hardhat local network
   ```
   npx hardhat deploy
   ```

### Deploy an Aave market in local Ethereum fork

To be able to deploy the default Aave market in fork, proceed with the following instructions:

1. Start a local Hardhat node in FORK mode to perform the test deployment, as follows:

   ```
   npm run node:fork
   ```

2. Run the next command to deploy the Aave market at the `localhost` network in fork mode:

   ```
   HARDHAT_NETWORK=localhost MARKET_NAME=Aave npx hardhat deploy
   ```

   The output of the command is a table of contracts with their corresponding addresses and the accounts involved within the deployment.

   If the deployment fails during execution, the next run will reuse the deployed contracts and resume the deployment.

### Deploy an Aave market in live network

1. To deploy an Aave market in a live network, like the Ethereum mainnet, you would need to run the following NPM command:

   ```
   HARDHAT_NETWORK=main MARKET_NAME=Aave npx hardhat deploy
   ```

## Project Structure

| Path                  | Description                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| deploy/               | Main deployment scripts dir location                                                                                            |
| ├─ 00-core/           | Core deployment, only needed to run once per network.                                                                           |
| ├─ 01-periphery_pre/  | Periphery contracts deployment, only need to run once per network.                                                              |
| ├─ 02-market/         | Market deployment scripts, depends of Core and Periphery deployment.                                                            |
| ├─ 03-periphery_post/ | Periphery contracts deployment after market is deployed.                                                                        |
| deployments/          | Artifacts location of the deployments, contains the addresses, the abi, solidity input metadata and the constructor parameters. |
| markets/              | Directory to configure Aave markets                                                                                             |
| tasks/                | Hardhat tasks to setup and review market configs                                                                                |
| helpers/              | Utility helpers to manage configs and deployments                                                                               |
