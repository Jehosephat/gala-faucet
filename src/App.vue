<template>
  <div id="app">
    <header>
      <h1>Gala Faucet</h1>
    </header>
    <main>
      <WalletConnect @registration-complete="refreshBalances" ref="walletConnectComponent" />
      <div v-if="isWalletConnected" class="content">
        <div class="left-column">
          <Balance network="mainnet" :wallet-address="walletAddress" :metamask-client="metamaskClient" ref="mainnetBalanceComponent" />
          <Balance network="testnet" :wallet-address="walletAddress" :metamask-client="metamaskClient" ref="testnetBalanceComponent" />
        </div>
        <div class="center-column">
          <div class="logo-container">
            <img src="@/assets/galafaucet.png" alt="Gala Faucet Logo" class="logo">
          </div>
        </div>
        <div class="right-column">
          <MultiplierDisplay :multiplier="faucetMultiplier" :burn-amount="burnAmount" />
          <BurnGala 
            :is-connected="isWalletConnected" 
            :metamask-client="metamaskClient" 
            :mainnet-balance="mainnetBalance"
            :locked-balance="mainnetLockedBalance"
            @burn-success="handleBurnSuccess" 
            @mint-success="handleMintSuccess" 
            @burn-amount-change="updateBurnAmount"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WalletConnect from './components/WalletConnect.vue'
import Balance from './components/Balance.vue'
import BurnGala from './components/BurnGala.vue'
import MultiplierDisplay from './components/MultiplierDisplay.vue'

const walletConnectComponent = ref<InstanceType<typeof WalletConnect> | null>(null)
const mainnetBalanceComponent = ref<InstanceType<typeof Balance> | null>(null)
const testnetBalanceComponent = ref<InstanceType<typeof Balance> | null>(null)

const isWalletConnected = computed(() => walletConnectComponent.value?.isConnected ?? false)
const metamaskClient = computed(() => walletConnectComponent.value?.metamaskClient ?? null)
const walletAddress = computed(() => walletConnectComponent.value?.walletAddress ?? '')

const mainnetBalance = computed(() => mainnetBalanceComponent.value?.balance ?? 0)
const mainnetLockedBalance = computed(() => mainnetBalanceComponent.value?.lockedBalance ?? 0)

const faucetMultiplier = Number(import.meta.env.VITE_FAUCET_MULTIPLIER)
const burnAmount = ref(0)

const handleBurnSuccess = () => {
  mainnetBalanceComponent.value?.fetchBalance()
}

const handleMintSuccess = () => {
  testnetBalanceComponent.value?.fetchBalance()
}

const refreshBalances = () => {
  mainnetBalanceComponent.value?.fetchBalance()
  testnetBalanceComponent.value?.fetchBalance()
}

const updateBurnAmount = (amount: number) => {
  burnAmount.value = amount
}
</script>

<style>
@import './assets/main.css';

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  color: var(--primary-color);
}

main {
  display: flex;
  flex-direction: column;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
}

.left-column, .right-column {
  width: 30%;
  display: flex;
  flex-direction: column;
}

.center-column {
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.logo-container {
  height: 300px; /* Adjust this value to match the approximate height of your left column */
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* New styles for consistent right column width */
.right-column > * {
  width: 100%;
}

.right-column .input,
.right-column .button {
  width: 100%;
  box-sizing: border-box;
}

/* Ensure the center column doesn't exceed the height of the left column */
@media (min-width: 768px) {
  .content {
    align-items: flex-start;
  }
}
</style>
