<template>
  <div id="app">
    <header>
      <h1>Gala Faucet</h1>
    </header>
    <main>
      <WalletConnect @registration-complete="refreshBalances" ref="walletConnectComponent" />
      <div v-if="isWalletConnected" class="balances">
        <Balance network="mainnet" :wallet-address="walletAddress" :metamask-client="metamaskClient" ref="mainnetBalanceComponent" />
        <Balance network="testnet" :wallet-address="walletAddress" :metamask-client="metamaskClient" ref="testnetBalanceComponent" />
      </div>
      <BurnGala 
        :is-connected="isWalletConnected" 
        :metamask-client="metamaskClient" 
        @burn-success="handleBurnSuccess" 
        @mint-success="handleMintSuccess" 
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WalletConnect from './components/WalletConnect.vue'
import Balance from './components/Balance.vue'
import BurnGala from './components/BurnGala.vue'

const walletConnectComponent = ref<InstanceType<typeof WalletConnect> | null>(null)
const mainnetBalanceComponent = ref<InstanceType<typeof Balance> | null>(null)
const testnetBalanceComponent = ref<InstanceType<typeof Balance> | null>(null)

const isWalletConnected = computed(() => walletConnectComponent.value?.isConnected ?? false)
const metamaskClient = computed(() => walletConnectComponent.value?.metamaskClient ?? null)
const walletAddress = computed(() => walletConnectComponent.value?.walletAddress ?? '')

const handleBurnSuccess = () => {
  mainnetBalanceComponent.value?.fetchBalance()
}

const refreshBalances = () => {
  mainnetBalanceComponent.value?.fetchBalance()
  testnetBalanceComponent.value?.fetchBalance()
}

const handleMintSuccess = () => {
  testnetBalanceComponent.value?.fetchBalance()
}
</script>

<style>
@import './assets/main.css';

#app {
  max-width: 800px;
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

.balances {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
</style>
