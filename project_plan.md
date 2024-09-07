Gala Faucet

Basic Concept

1. User visits the GALA Faucet website
2. User connects their mainnet wallet
3. User chooses a testnet address to receive the testnet GALA
4. User chooses an amount of testnet GALA to receive
5. App determines how much mainnet GALA must be burned to mint that amount of testnet GALA
6. User clicks a button to initiate the transaction
7. User's mainnet wallet is charged and the corresponding amount of testnet GALA is minted in the user's testnet wallet

Technical Details

1. The app must provide a wallet connection interface
2. The app must fetch the user's mainnet GALA balance
3. The app must have a way to calculate the amount of mainnet GALA needed to mint the desired amount of testnet GALA
4. The app must have a way to display the amount of mainnet GALA that must be burned
5. The app must have a way to initiate the transaction
6. The app must provide a way to input the testnet address and the amount of testnet GALA to mint

Resources

1. GalaSwap API (mainnet): documented here: https://galaswap.gala.com/info/api.html#tag/API:-GalaChain-Operations
2. GalaSwap API (testnet): documented here: https://stage-galaswap.gala.com/info/api.html#tag/API:-GalaChain-Operations
3. GalaChain SDK: https://github.com/GalaChain/sdk
4. GalaChain SDK Docs: https://docs.galachain.com/latest/
5. GalaChain SDK packages:
    a. cli: https://www.npmjs.com/package/@gala-chain/cli
    b. api: https://www.npmjs.com/package/@gala-chain/api
    c. chaincode: https://www.npmjs.com/package/@gala-chain/chaincode
    d. client: https://www.npmjs.com/package/@gala-chain/client
    e. test: https://www.npmjs.com/package/@gala-chain/test
    f. connect: https://www.npmjs.com/package/@gala-chain/connect
    g. ui: https://www.npmjs.com/package/@gala-chain/ui (not published yet)

