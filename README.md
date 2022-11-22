# Aave V3 Deployments

This Node.js repository contains the configuration and deployment scripts for the Aave V3 protocol core and periphery contracts. The repository makes use of `hardhat` and `hardhat-deploy` tools to facilitate the deployment of Aave protocol.

## Requirements

- Node.js >= 14
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

### Deploy an Aave market in local Ethereum fork

To be able to deploy the default Aave market in fork, proceed with the following instructions:

1. Start a local Hardhat node in FORK mode to perform the test deployment, as follows:

   ```
   npm run node:fork
   ```

2. Run the next command to deploy the default Aave market at the `localhost` network in fork mode:

   ```
   npm run deploy:market:aave:fork:local
   ```

   The Aave market deployment scripts will also deploy the Core and Periphery contracts before deploying the actual market, due they are marked as dependencies at the `hardhat-deploy` deploy function scripts. If the current network there is already a Core deployment, the script will reuse the contract addresses saved at `deployments` artifacts directory. The output of the command is a table of contracts with their corresponding addresses and the accounts involved within the deployment.

   If the deployment fails during execution, the next run will reuse the deployed contracts and resume the deployment.

### Deploy an Aave market in live network

1. To deploy an Aave market in a live network, like the Ethereum mainnet, you would need to run the following NPM command:

   ```
   npm run deploy:market:aave:main
   ```

## Project Structure

| Path             | Description                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| deploy/          | Main deployment scripts dir location                                                                                                 |
| ├─ 00-core/      | Core deployment, only needed to run once per network.                                                                                |
| ├─ 01-periphery/ | Periphery contracts deployment, only need to run once per network.                                                                   |
| ├─ 02-market/    | Market deployment scripts, depends of Core and Periphery deployment.                                                                 |
| deployments/     | Artifacts location of the deployments, contains the addresses, the abi, solidity input metadata and even the constructor parameters. |
| markets/         | Directory to configure Aave markets                                                                                                  |
| tasks/           | Utility Hardhat scripts                                                                                                              |
