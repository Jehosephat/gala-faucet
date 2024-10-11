<template>
  <div v-if="isConnected" class="burn-gala">
    <div class="header">
      <h3>Burn GALA</h3>
      <span class="fee-label">Fee: 1 GALA</span>
    </div>
    <input 
      v-model="amount" 
      type="text" 
      placeholder="Amount to burn" 
      class="input full-width" 
      @input="formatAmount"
    />
    <p class="min-amount">Minimum: {{ minAmount }} GALA</p>
    <button
      @click="burnGala"
      class="button full-width"
      :class="{ 'button-disabled': isBurning || !isValidAmount }"
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

const emit = defineEmits(['burnSuccess', 'mintSuccess', 'burnAmountChange'])

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

watch(amount, (newAmount) => {
  isError.value = false
  burnMessage.value = ''

  const numAmount = Number(newAmount)
  if (numAmount < minAmount) {
    burnMessage.value = `Amount must be at least ${minAmount} GALA`
    isError.value = true
  } else if (numAmount > availableBalance.value) {
    burnMessage.value = `Amount exceeds available balance of ${availableBalance.value} GALA`
    isError.value = true
  }
  
  emit('burnAmountChange', Number(newAmount))
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
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

h3 {
  margin: 0;
}

.fee-label {
  font-size: 0.8em;
  color: #888888;
}

.full-width {
  width: 100%;
  box-sizing: border-box;
}

.min-amount {
  font-size: 0.8em;
  color: #888888;
  margin-top: 5px;
  margin-bottom: 10px;
}

.button {
  margin-top: 10px;
  transition: all 0.3s ease;
}

.button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #cccccc;
  color: #666666;
}

.error-message {
  color: #ff4d4d;
  margin-top: 10px;
}
</style>
