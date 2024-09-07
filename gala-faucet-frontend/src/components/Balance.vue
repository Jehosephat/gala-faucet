<template>
  <div>
    <h2>Balance Component</h2>
    <button @click="connectWallet" :disabled="isConnected">
      {{ isConnected ? 'Wallet Connected' : 'Connect Wallet' }}
    </button>
    <div v-if="isConnected">
      <p>Connected Wallet: {{ walletAddress }}</p>
      <button @click="fetchBalance">Fetch Balance</button>
      <p v-if="balance !== null">Balance: {{ balance }} GALA</p>
    </div>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { MetamaskConnectClient } from '@gala-chain/connect'

const metamaskClient = new MetamaskConnectClient(`${import.meta.env.VITE_APP_API_URL}`);
// const tokenClient = new TokenApi('http://localhost:3001/asset/GalaChainToken', metamaskClient);

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
  if (!isConnected.value) {
    error.value = 'Please connect your wallet first.'
    return
  }

  try {
    error.value = ''
    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/getBalance`, {
      params: { walletAddress: walletAddress.value }
    })
    balance.value = response.data
    console.log('Balance fetched:', balance.value)
  } catch (err) {
    console.error('Error fetching balance:', err)
    error.value = 'Error fetching balance. Please try again.'
    balance.value = null
  }
}

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
</script>