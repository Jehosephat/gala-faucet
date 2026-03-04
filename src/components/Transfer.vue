<template>
  <div v-if="isConnected" class="transfer-gala">
    <div class="header">
      <h3>Transfer GALA</h3>
      <span class="fee-label">Network fee applies</span>
    </div>
    <input
      v-model="toAddress"
      type="text"
      placeholder="Target wallet (0x... or eth|...)"
      class="input full-width"
      @input="clearMessage"
    />
    <input
      v-model="amount"
      type="text"
      placeholder="Amount to transfer"
      class="input full-width amount-input"
      @input="formatAmount"
    />
    <button
      @click="transferGala"
      class="button full-width"
      :class="{ 'button-disabled': isTransferring || !isValidTransfer }"
      :disabled="isTransferring || !isValidTransfer"
    >
      {{ isTransferring ? 'Transferring...' : 'Transfer GALA' }}
    </button>
    <p v-if="transferMessage" :class="{ 'error-message': isError }">{{ transferMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import axios from 'axios'
import { MetamaskConnectClient } from '@gala-chain/connect'
import { tokenConfig } from '../config/tokens'

const props = defineProps<{
  isConnected: boolean
  metamaskClient: MetamaskConnectClient | null
  mainnetBalance: number
  lockedBalance: number
}>()

const emit = defineEmits(['transferSuccess'])

const toAddress = ref('')
const amount = ref('')
const transferMessage = ref('')
const isTransferring = ref(false)
const isError = ref(false)
const minAmount = 0.00000001

const availableBalance = computed(() => props.mainnetBalance - props.lockedBalance)

const normalizedToAddress = computed(() => {
  const trimmed = toAddress.value.trim()
  if (!trimmed) {
    return ''
  }
  if (trimmed.startsWith('eth|')) {
    return trimmed
  }
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return `eth|${trimmed.slice(2)}`
  }
  return ''
})

const isValidTransfer = computed(() => {
  const numAmount = Number(amount.value)
  return (
    !!normalizedToAddress.value &&
    Number.isFinite(numAmount) &&
    numAmount >= minAmount &&
    numAmount <= availableBalance.value
  )
})

const clearMessage = () => {
  transferMessage.value = ''
  isError.value = false
}

const formatAmount = () => {
  clearMessage()

  if (amount.value === '0' || amount.value === '0.') {
    return
  }

  if (amount.value.startsWith('.')) {
    amount.value = `0${amount.value}`
  }

  amount.value = amount.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')

  if (amount.value.length > 1 && amount.value.startsWith('0') && !amount.value.startsWith('0.')) {
    amount.value = amount.value.replace(/^0+/, '')
  }
}

watch([toAddress, amount, availableBalance], () => {
  clearMessage()

  if (toAddress.value.trim() && !normalizedToAddress.value) {
    transferMessage.value = 'Target wallet must be eth|... or 0x...'
    isError.value = true
    return
  }

  if (!amount.value) {
    return
  }

  const numAmount = Number(amount.value)
  if (!Number.isFinite(numAmount) || numAmount < minAmount) {
    transferMessage.value = `Amount must be at least ${minAmount} GALA`
    isError.value = true
  } else if (numAmount > availableBalance.value) {
    transferMessage.value = `Amount exceeds available balance of ${availableBalance.value} GALA`
    isError.value = true
  }
})

const transferGala = async () => {
  if (!props.metamaskClient || !isValidTransfer.value) {
    return
  }

  isTransferring.value = true
  clearMessage()

  try {
    const from = `eth|${props.metamaskClient.getWalletAddress.slice(2)}`

    const transferDto = {
      from,
      to: normalizedToAddress.value,
      quantity: amount.value,
      tokenInstance: tokenConfig.mainnet,
      uniqueKey: `testnet-faucet-transfer-${Date.now()}`
    }

    const signedTransferDto = await props.metamaskClient.sign('TransferToken', transferDto)
    await axios.post(`${import.meta.env.VITE_MAINNET_GATEWAY_TOKEN_API}/TransferToken`, signedTransferDto)

    transferMessage.value = `Transferred ${amount.value} GALA to ${normalizedToAddress.value}`
    amount.value = ''
    emit('transferSuccess')
  } catch (error) {
    console.error('Error transferring GALA:', error)
    transferMessage.value = 'Error transferring GALA. Please try again.'
    isError.value = true
  } finally {
    isTransferring.value = false
  }
}
</script>

<style scoped>
.transfer-gala {
  width: 100%;
  margin-top: 20px;
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

.amount-input {
  margin-top: 10px;
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
