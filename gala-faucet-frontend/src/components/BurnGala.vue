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

const amount = ref('')
const burnMessage = ref('')

const burnGala = async () => {
	if (!props.metamaskClient) {
		burnMessage.value = 'Wallet not connected'
	} else {
		try {
			const walletAddress = props.metamaskClient?.getWalletAddress
			const uniqueKey = `faucet-burn-${walletAddress}-${Date.now()}`

			const unsignedDto = {
				"uniqueKey": uniqueKey,
				"tokenInstances": [],
				"items": {
					"quantity": amount.value,
					"tokenInstanceKey": {
					"collection": "GALA",
					"category": "Unit",
					"type": "none",
					"additionalKey": "none",
					"instance": "0"
					}
				}
			}
			const signedDto = await props.metamaskClient.sign("BurnToken", unsignedDto)
			const requestDto = {
				signature: signedDto.signature,
				...unsignedDto
			}

			const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/burnMainnetGala`, requestDto)
			burnMessage.value = `Successfully burned ${amount.value} GALA`
					amount.value = ''
		} catch (error) {
			console.error('Error burning GALA:', error)
			burnMessage.value = 'Error burning GALA. Please try again.'
		}
	}
}
</script>
