<template>
  <div id="app">
    <h1>Gala Faucet</h1>
    <Balance ref="balanceComponent" />
    <BurnGala :is-connected="isWalletConnected" :metamask-client="metamaskClient" @burn-success="handleBurnSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
