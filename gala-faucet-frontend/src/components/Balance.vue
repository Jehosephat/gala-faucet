<template>
  <div>
    <button @click="connectWallet" v-if="!isConnected">Connect Wallet</button>
    <div v-else>
      <p>Connected Wallet: {{ walletAddress }}</p>
      <p>Balance: {{ balance }} GALA</p>
    </div>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { MetamaskConnectClient } from '@gala-chain/connect'

const metamaskClient = new MetamaskConnectClient(`${import.meta.env.VITE_APP_API_URL}`);

const balance = ref<number | null>(null)
const walletAddress = ref('')
const error = ref('')
const isConnected = ref(false)

const connectWallet = async () => {
  try {
    await metamaskClient.connect()
    let address = metamaskClient.getWalletAddress
    if (address.startsWith('0x')) {
      address = "eth|" + address.slice(2)
    }
    // TODO: register address if not found (getPublicKey)?
    walletAddress.value = address
    isConnected.value = true
    error.value = ''
  } catch (err) {
    console.error('Error connecting wallet:', err)
    error.value = 'Failed to connect wallet. Please try again.'
  }
}

const fetchBalance = async () => {
  try {
    error.value = ''
    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/getBalance`, {
      params: { walletAddress: walletAddress.value }
    })
    balance.value = response.data
  } catch (err) {
    console.error('Error fetching balance:', err)
    error.value = 'Error fetching balance. Please try again.'
    balance.value = null
  }
}

watch(isConnected, (newValue) => {
  if (newValue) {
    fetchBalance()
  }
})

onMounted(async () => {
  try {
    const address = metamaskClient.getWalletAddress
    if (address) {
      walletAddress.value = address
      isConnected.value = true
    }
  } catch (err) {
    console.error('No wallet connected on mount:', err)
  }
})

defineExpose({ isConnected, metamaskClient })
</script>