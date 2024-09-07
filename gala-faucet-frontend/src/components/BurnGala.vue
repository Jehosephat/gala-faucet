<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const amount = ref('')
const signature = ref('')
const signerPublicKey = ref('')

const burnGala = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/burnMainnetGala`, {
      amount: amount.value,
      signature: signature.value,
      signerPublicKey: signerPublicKey.value
    })
    console.log('Burn successful:', response.data)
  } catch (error) {
    console.error('Error burning GALA:', error)
  }
}
</script>

<template>
  <div>
    <input
      v-model="amount"
      type="text"
      placeholder="Amount to burn"
    />
    <input
      v-model="signature"
      type="text"
      placeholder="Signature"
    />
    <input
      v-model="signerPublicKey"
      type="text"
      placeholder="Signer Public Key"
    />
    <button @click="burnGala">Burn GALA</button>
  </div>
</template>
