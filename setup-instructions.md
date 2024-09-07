# Gala Faucet Setup Instructions

Use this guide to set up the Gala Faucet application.

It uses Vue.js for the frontend, Node.js for the backend, and NestJS for the API.

Write the complete code for every step. Do not get lazy. Write everything that is needed.

Refer to the project plan for the complete list of resources and requirements.

It uses the following packages:

- @gala-chain/api
- @gala-chain/client
- @gala-chain/chaincode
- @gala-chain/cli
- @gala-chain/connect
- @gala-chain/test

## Prerequisites

- Node.js (v20.12.2)
- npm (v10.9.0)
- Vue CLI (v5.0.8)
- Nest CLI (v10.1.0)
- Git (v2.39.2)

## Create a new nestjs project. 

It needs the following endpoints:

- getBalance
    This should return the balance of the user's mainnet wallet. This will call the getBalance endpoint in the GalaChain API using secret credentials to sign the request dto.
- burnMainnetGala
    This should burn the user's mainnet GALA. Based on an environment variable, it should mint testnet GALA proportional to the amount of mainnet GALA burned.
    This will call the mintToken endpoint in the GalaSwap API using secret credentials to sign the request dto.

## Create a new vue project

The UI needs to have the following components:

- connect wallet
- display balance
- enter desired testnet GALA amount to mint
- display the calculated mint fee
- button to initiate the burn and mint transaction
    - this will prompt the user to sign the transaction using their wallet
    - the UI should display the transaction in progress
    - the UI should display the transaction results

Front end style should be based on https://galaswap.gala.com/ styles.






