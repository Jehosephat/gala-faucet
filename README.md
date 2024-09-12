# gala-faucet
Lightweight app that allows users to burn GALA tokens on mainnet in order to get GALA tokens on testnet

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Git

### Clone the repository
    ```bash
    git clone https://github.com/your-username/gala-faucet.git
    cd gala-faucet
    ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd gala-faucet-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `gala-faucet-backend` directory with the following content:
   ```
    CHAIN_TESTNET_API_BASE_URL=https://int-galachain-gateway-chain-platform-stage-chain-platform-eks.stage.galachain.com
    CHAIN_MAINNET_API_BASE_URL=https://int-galachain-gateway-chain-platform-stage-chain-platform-eks.stage.galachain.com
    FAUCET_MULTIPLIER=100
    FRONTEND_URL=http://localhost:3000
    FAUCET_ADMIN_PRIVATE_KEY=0x...
   ```
   Replace the placeholders with your actual values.

4. Start the backend server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd gala-faucet-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `gala-faucet-frontend` directory with the following content:
   ```
    VITE_APP_API_URL=http://localhost:3001
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage
1. Open your browser and navigate to `http://localhost:3001` (or the port specified by Vite).
2. Connect your wallet using the "Connect Wallet" button.
3. Enter the amount of GALA tokens you want to burn on mainnet.
4. Click "Burn GALA" to initiate the transaction.
5. Once the transaction is confirmed, you'll receive an amount of GALA tokens on the testnet equal to the amount of GALA tokens you burned on mainnet times the multiplier set in the .env file.

## Modifying the Application

### Backend
- The main service logic is located in `gala-faucet-backend/src/app.service.ts`.
- To modify the API endpoints, edit `gala-faucet-backend/src/app.controller.ts`.
- Add new dependencies in `gala-faucet-backend/package.json`.

### Frontend
- The main application component is in `gala-faucet-frontend/src/App.vue`.
- Individual components are located in `gala-faucet-frontend/src/components/`.
- To modify the Wallet interactions, edit `BurnGala.vue` and `WalletConnect.vue`.
- Styling can be adjusted in the `<style>` sections of the Vue components or in separate CSS files.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
[MIT License](LICENSE)