<template>
  <div class="balance">
    <h3>{{ networkName }} Balance</h3>
    <p class="balance-amount">{{ balance }} GALA</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'

const props = defineProps<{
  network: 'mainnet' | 'testnet'
  walletAddress: string
}>()

const balance = ref<number | null>(null)
const error = ref('')

const networkName = computed(() => props.network === 'mainnet' ? 'Mainnet' : 'Testnet')

const fetchBalance = async () => {
  if (!props.walletAddress) return

  try {
    error.value = ''
    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/getBalance`, {
      params: { walletAddress: props.walletAddress, network: props.network }
    })
    balance.value = response.data
  } catch (err) {
    console.error(`Error fetching ${props.network} balance:`, err)
    error.value = `Error fetching ${props.network} balance. Please try again.`
    balance.value = null
  }
}

watch(() => props.walletAddress, fetchBalance)

onMounted(fetchBalance)

defineExpose({ fetchBalance })
</script>

<style scoped>
.balance {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

h3 {
  color: var(--primary-color);
  margin-bottom: 10px;
}

.balance-amount {
  font-size: 1.5em;
  font-weight: bold;
}

.error {
  color: #ff4d4d;
  margin-top: 10px;
}
</style>