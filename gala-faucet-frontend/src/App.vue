<template>
  <div id="app">
    <h1>Gala Faucet</h1>
    <Balance ref="balanceComponent" />
    <BurnGala :is-connected="isWalletConnected" :metamask-client="metamaskClient" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref } from 'vue'
import Balance from './components/Balance.vue'
import BurnGala from './components/BurnGala.vue'
import { MetamaskConnectClient } from '@gala-chain/connect'

interface BalanceComponentExpose {
  isConnected: boolean;
  metamaskClient: MetamaskConnectClient;
}

const balanceComponent = ref<InstanceType<typeof Balance> | null>(null)
const isWalletConnected = computed(() => balanceComponent.value?.isConnected ?? false)
const metamaskClient = computed(() => balanceComponent.value?.metamaskClient ?? null)

</script>
