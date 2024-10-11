# Gala Faucet

A lightweight application that allows users to burn GALA tokens on mainnet in order to receive GALA tokens on testnet.

## Project Structure

This project consists of a single frontend application built with Vue.js and Vite.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Git

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jehosephat/gala-faucet.git
   cd gala-faucet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `gala-faucet-frontend` directory with the following content:
   ```
   VITE_BURN_GATEWAY_API=<gateway where burn transactions are sent>
   VITE_FAUCET_GATEWAY_API=<gateway where faucet transactions are sent (minting)>
   VITE_FAUCET_MULTIPLIER=<multiplier for the faucet (100 = 1:100)>
   VITE_FAUCET_ADMIN_PRIVATE_KEY=<private key of the faucet admin>
   VITE_FAUCET_ADMIN_PUBLIC_KEY=<public key of the faucet admin>
   ```
   Replace the placeholders with your actual values.

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000` (or the port specified by Vite).
2. Connect your wallet using the "Connect Wallet" button.
3. Once connected, you'll see your GALA balance on both mainnet and testnet.
4. Enter the amount of GALA tokens you want to burn on mainnet.
5. Click "Burn GALA" to initiate the transaction.
6. Once the transaction is confirmed, you'll receive an amount of GALA tokens on the testnet equal to the amount of GALA tokens you burned on mainnet times the multiplier set in the .env file.

## Modifying the Application

- The main application component is in `src/App.vue`.
- Individual components are located in `src/components/`:
  - `WalletConnect.vue`: Handles wallet connection
  - `Balance.vue`: Displays GALA balance for mainnet and testnet
  - `BurnGala.vue`: Handles the burning and minting process
- Environment variables are defined in the `.env` file and typed in `src/env.d.ts`.
- The Vite configuration is in `vite.config.js`.

