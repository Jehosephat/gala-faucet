<template>
  <div class="wallet-connect">
    <button @click="connectWallet" v-if="!isConnected" class="button">Connect Wallet</button>
    <div v-else>
      <p class="wallet-address">Connected: {{ truncatedAddress }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MetamaskConnectClient } from '@gala-chain/connect'

const metamaskClient = new MetamaskConnectClient();
const isConnected = ref(false)
const walletAddress = ref('')

// Define emits at the top level of the script setup
const emit = defineEmits(['registrationComplete'])

const truncatedAddress = computed(() => {
  if (walletAddress.value.length > 10) {
    return walletAddress.value
  }
  return walletAddress.value
})

const connectWallet = async () => {
  try {
    await metamaskClient.connect()
    let address = metamaskClient.getWalletAddress
    if (address.startsWith('0x')) {
      address = "eth|" + address.slice(2)
    }
    walletAddress.value = address
    isConnected.value = true
    emit('registrationComplete')
  } catch (err) {
    console.error('Error connecting wallet:', err)
  }
}

defineExpose({ isConnected, metamaskClient, walletAddress })
</script>

<style scoped>
.wallet-connect {
  margin-bottom: 20px;
}

.wallet-address {
  font-size: 0.9em;
  color: var(--primary-color);
}
</style>
