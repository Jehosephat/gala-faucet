<template>
  <div v-if="isConnected">
	<h3>Burn GALA</h3>
	<input 
	  v-model="amount" 
	  type="text" 
	  placeholder="Amount to burn" 
	  class="input" 
	  @input="formatAmount"
	/>
	<p class="min-amount">Minimum amount: {{ minAmount }} GALA</p>
	<button
	  @click="burnGala"
	  class="button"
	  :disabled="isBurning || !isValidAmount"
	>
	  {{ isBurning ? 'Burning...' : 'Burn GALA' }}
	</button>
	<p v-if="burnMessage" :class="{ 'error-message': isError }">{{ burnMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { MetamaskConnectClient } from '@gala-chain/connect'
import { signObject } from '../../utils/signing'
import { tokenConfig } from '../config/tokens'

const props = defineProps<{
  isConnected: boolean
  metamaskClient: MetamaskConnectClient | null
  mainnetBalance: number
  lockedBalance: number
}>()

const emit = defineEmits(['burnSuccess', 'mintSuccess'])

const amount = ref('')
const burnMessage = ref('')
const isBurning = ref(false)
const isError = ref(false)
const minAmount = 0.1 // Set this to your desired minimum amount

const availableBalance = computed(() => props.mainnetBalance - props.lockedBalance)

const isValidAmount = computed(() => {
  const numAmount = Number(amount.value)
  return numAmount >= minAmount && numAmount <= availableBalance.value
})

const formatAmount = () => {
  // If the input is just '0' or '0.', do nothing
  if (amount.value === '0' || amount.value === '0.') {
    return;
  }

  // If the first character is a decimal point, prepend a zero
  if (amount.value.startsWith('.')) {
    amount.value = '0' + amount.value;
  }

  // Remove any non-numeric characters except the first decimal point
  amount.value = amount.value.replace(/[^\d.]/g, '')
                             .replace(/(\..*)\./g, '$1');

  // Remove leading zeros if the number doesn't start with "0."
  if (amount.value.length > 1 && amount.value.startsWith('0') && !amount.value.startsWith('0.')) {
    amount.value = amount.value.replace(/^0+/, '');
  }
}

watch(amount, () => {
  isError.value = false
  burnMessage.value = ''

  const numAmount = Number(amount.value)
  if (numAmount < minAmount) {
    burnMessage.value = `Amount must be at least ${minAmount} GALA`
    isError.value = true
  } else if (numAmount > availableBalance.value) {
    burnMessage.value = `Amount exceeds available balance of ${availableBalance.value} GALA`
    isError.value = true
  }
})

const burnGala = async () => {
  if (!props.metamaskClient || !isValidAmount.value) {
    return
  }

  isBurning.value = true
  burnMessage.value = ''
  isError.value = false

  try {
    const owner = `eth|${props.metamaskClient.getWalletAddress.slice(2)}`
    const burnAmount = amount.value

    // Burn on mainnet
    const burnTokensDto = { 
      owner,
      tokenInstances: [{
        quantity: burnAmount,
        tokenInstanceKey: tokenConfig.mainnet
      }],
      uniqueKey: `testnet-faucet-burn-${Date.now()}`	
    }

	const signedBurnDto = await props.metamaskClient.sign("BurnTokens", burnTokensDto)
	// TODO: do a dry run to get fees and make sure the burn will succeed before moving on to minting
	await axios.post(`${import.meta.env.VITE_BURN_GATEWAY_API}/BurnTokens`, signedBurnDto)

    emit('burnSuccess')

    // Mint on testnet
    const mintAmount = parseFloat(burnAmount) * Number(import.meta.env.VITE_FAUCET_MULTIPLIER)
    const mintTokensDto = {
      owner: owner,
      quantity: mintAmount.toString(),
      tokenClass: tokenConfig.testnet,
      tokenInstance: tokenConfig.testnet.instance,
      uniqueKey: `mint-${signedBurnDto.uniqueKey}`,
      signerPublicKey: import.meta.env.VITE_FAUCET_ADMIN_PUBLIC_KEY
    }

    // sign with faucet admin credentials
    const signedMintTokensDto = signObject(mintTokensDto, import.meta.env.VITE_FAUCET_ADMIN_PRIVATE_KEY)
    await axios.post(`${import.meta.env.VITE_FAUCET_GATEWAY_API}/MintTokenWithAllowance`, signedMintTokensDto)

    emit('mintSuccess')

    burnMessage.value = `Successfully burned ${burnAmount} GALA on mainnet and minted ${mintAmount} GALA on testnet`
    amount.value = ''
  } catch (error) {
    console.error('Error burning/minting GALA:', error)
    burnMessage.value = 'Error burning/minting GALA. Please try again.'
    isError.value = true
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

.min-amount {
  font-size: 0.8em;
  color: #888;
  margin-bottom: 10px;
}

.error-message {
  color: #ff4d4d;
}
</style>
