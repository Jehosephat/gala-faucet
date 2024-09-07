# Gala Faucet Setup Guide

## Prerequisites
- Node.js (v20.12.2)
- npm (v10.9.0)
- Vue CLI (v5.0.8)
- Nest CLI (v10.1.0)
- Git (v2.39.2)

## Backend Setup (NestJS)

1. Create a new NestJS project:
   ```
   nest new gala-faucet-backend
   cd gala-faucet-backend
   ```

2. Install Gala Chain packages:
   ```
   npm install @gala-chain/api @gala-chain/client @gala-chain/chaincode @gala-chain/cli @gala-chain/connect @gala-chain/test
   ```

3. Update `src/app.controller.ts` and `src/app.service.ts` with the provided code.

4. Update `package.json` with the correct dependencies.

## Frontend Setup (Vue.js)

1. Create a new Vue project:
   ```
   cd ..
   vue create gala-faucet-frontend
   cd gala-faucet-frontend
   ```

2. Choose the following options during setup:
   - Vue 3
   - Babel
   - TypeScript
   - Router (history mode)
   - Vuex
   - CSS Pre-processors (Sass/SCSS with dart-sass)
   - Linter / Formatter (ESLint + Prettier)
   - Use dedicated config files

3. Install Gala Chain packages:
   ```
   npm install @gala-chain/api @gala-chain/client @gala-chain/chaincode @gala-chain/cli @gala-chain/connect @gala-chain/test
   ```

4. Install axios:
   ```
   npm install axios
   ```

5. Create the following components in `src/components/`:
   - WalletConnect.vue
   - BalanceDisplay.vue
   - MintForm.vue

6. Update `src/App.vue` to include these components.

7. Create `src/services/api.ts` for API communication.

## Final Steps

1. Review and resolve any linter errors in both frontend and backend code.
2. Implement actual wallet connection logic, integrate with Gala Chain SDK, and add error handling.
3. Set up proper environment variables for API URLs and other configuration details.
4. Test the connection between frontend and backend.

Remember to refer to the Gala Chain documentation for specific implementation details and best practices.