<template>
  <div>
    <input
      v-model="walletAddress"
      type="text"
      placeholder="Enter wallet address"
    />
    <button @click="fetchBalance">Fetch Balance</button>
    <p v-if="balance !== null">Balance: {{ balance }} GALA</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const balance = ref<number | null>(null)
const walletAddress = ref('')

const fetchBalance = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/getBalance`, {
      params: { walletAddress: walletAddress.value }
    })
    balance.value = response.data
    console.log('Balance fetched:', balance.value) // Add this line for debugging
  } catch (error) {
    console.error('Error fetching balance:', error)
  }
}
</script>