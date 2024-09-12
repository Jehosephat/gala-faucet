<template>
  <div id="app">
    <header>
      <h1>Gala Faucet</h1>
    </header>
    <main>
      <Balance ref="balanceComponent" />
      <BurnGala :is-connected="isWalletConnected" :metamask-client="metamaskClient" @burn-success="handleBurnSuccess" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Balance from './components/Balance.vue'
import BurnGala from './components/BurnGala.vue'
import { MetamaskConnectClient } from '@gala-chain/connect'

const balanceComponent = ref<InstanceType<typeof Balance> | null>(null)
const isWalletConnected = computed(() => balanceComponent.value?.isConnected ?? false)
const metamaskClient = computed(() => balanceComponent.value?.metamaskClient ?? null)

const handleBurnSuccess = () => {
  balanceComponent.value?.fetchBalance()
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
  gap: 20px;
}
</style>
