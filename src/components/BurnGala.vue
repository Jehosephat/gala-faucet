<template>
  <div v-if="isConnected">
	<h3>Burn GALA</h3>
	<input v-model="amount" type="text" placeholder="Amount to burn" class="input" />
	<button
	  @click="burnGala"
	  class="button"
	  :disabled="isBurning"
	>
	  {{ isBurning ? 'Burning...' : 'Burn GALA' }}
	</button>
	<p v-if="burnMessage">{{ burnMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { MetamaskConnectClient } from '@gala-chain/connect'
import { signObject } from '../../utils/signing'

const props = defineProps<{
  isConnected: boolean
  metamaskClient: MetamaskConnectClient | null
}>()

const emit = defineEmits(['burnSuccess'])

const amount = ref('')
const burnMessage = ref('')
const isBurning = ref(false)

const burnGala = async () => {
	if (!props.metamaskClient) {
		burnMessage.value = 'Wallet not connected'
		return
	}

	isBurning.value = true
	burnMessage.value = ''

	try {
		const owner = `eth|${props.metamaskClient.getWalletAddress.slice(2)}`
		const burnAmount = amount.value

		// Burn on mainnet
		const burnTokensDto = { 
			owner,
			tokenInstances: [{
				quantity: burnAmount,
				tokenInstanceKey: {
					collection: "GALA",
					category: "Unit",
					type: "none",
					additionalKey: "none",
					instance: "0"
				}
			}],
			uniqueKey: `testnet-faucet-burn-${Date.now()}`
		}

		const signedBurnDto = await props.metamaskClient.sign("BurnTokens", burnTokensDto)
		// TODO: do a dry run to get fees and make sure the burn will succeed before moving on to minting
		await axios.post(`${import.meta.env.VITE_BURN_GATEWAY_API}/BurnTokens`, signedBurnDto)

		// Mint on testnet
		const mintAmount = parseFloat(burnAmount) * Number(import.meta.env.VITE_FAUCET_MULTIPLIER)
		const mintTokensDto = {
			owner: owner,
			quantity: mintAmount.toString(),
			tokenClass: {
				collection: "GALA",
				category: "Unit",
				type: "none",
				additionalKey: "none"
			},
			tokenInstance: "0",
			uniqueKey: `mint-${signedBurnDto.uniqueKey}`,
			signerPublicKey: import.meta.env.VITE_FAUCET_ADMIN_PUBLIC_KEY
		}

		// sign with faucet admin credentials
		const signedMintTokensDto = signObject(mintTokensDto, import.meta.env.VITE_FAUCET_ADMIN_PRIVATE_KEY)
		console.log('signedMintTokensDto', signedMintTokensDto)
		const mintResponse = await axios.post(`${import.meta.env.VITE_FAUCET_GATEWAY_API}/MintTokenWithAllowance`, signedMintTokensDto)
		console.log('mintResponse', mintResponse)
		burnMessage.value = `Successfully burned ${burnAmount} GALA on mainnet and minted ${mintAmount} GALA on testnet`
		emit('burnSuccess')
		amount.value = ''
	} catch (error) {
		console.error('Error burning/minting GALA:', error)
		burnMessage.value = 'Error burning/minting GALA. Please try again.'
	} finally {
		isBurning.value = false
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
