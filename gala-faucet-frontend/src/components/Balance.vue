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

const metamaskClient = new MetamaskConnectClient();
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
    await fetchBalance()
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
      await fetchBalance()
    }
  } catch (err) {
    console.error('No wallet connected on mount:', err)
  }
})

defineExpose({ isConnected, metamaskClient, fetchBalance })
</script>

<style scoped>
.wallet-info {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.wallet-address {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7);
}

.balance {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 10px;
}

.error {
  color: #ff4d4d;
  margin-top: 10px;
}
</style>