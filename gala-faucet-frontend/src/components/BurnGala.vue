<template>
  <div v-if="isConnected">
	<h3>Burn GALA</h3>
	<input v-model="amount" type="text" placeholder="Amount to burn" />
	<button @click="burnGala">Burn GALA</button>
	<p v-if="burnMessage">{{ burnMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { MetamaskConnectClient } from '@gala-chain/connect'

const props = defineProps<{
  isConnected: boolean
  metamaskClient: MetamaskConnectClient | null
}>()

const emit = defineEmits(['burnSuccess'])

const amount = ref('')
const burnMessage = ref('')

const burnGala = async () => {
	if (!props.metamaskClient) {
		burnMessage.value = 'Wallet not connected'
	} else {
		try {
			const burnTokensDto = { 
				owner: `eth|${props.metamaskClient.getWalletAddress.slice(2)}`,
				tokenInstances: [{
					quantity: amount.value,
					tokenInstanceKey: {
						collection: "GALA",
						category: "Unit",
						type: "none",
						additionalKey: "none",
						instance: "0"
					}
				}],
				uniqueKey: `galaswap-operation-testnet-faucet-burn-${Date.now()}`
			}

			const signedDto = await props.metamaskClient.sign("BurnTokens", burnTokensDto)

			console.log("Signed", signedDto)
			const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/burnMainnetGala`, signedDto)
			burnMessage.value = `Successfully burned ${amount.value} GALA`
			emit('burnSuccess')
			amount.value = ''
		} catch (error) {
			console.error('Error burning GALA:', error)
			burnMessage.value = 'Error burning GALA. Please try again.'
		}
	}
}
</script>

<style scoped>
.burn-gala {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
}

input {
  width: 100%;
  margin-bottom: 15px;
}

button {
  width: 100%;
}

.burn-message {
  margin-top: 15px;
  font-weight: bold;
}
</style>
