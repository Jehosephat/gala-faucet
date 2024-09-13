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
import { MetamaskConnectClient } from '@gala-chain/connect'

const props = defineProps<{
  network: 'mainnet' | 'testnet'
  walletAddress: string
  metamaskClient: MetamaskConnectClient | null
}>()

const balance = ref<number | null>(null)
const error = ref('')

const networkName = computed(() => props.network === 'mainnet' ? 'Mainnet' : 'Testnet')

const fetchBalance = async () => {
  if (!props.walletAddress || !props.metamaskClient) return

  const apiBaseUrl = props.network === 'mainnet' 
    ? import.meta.env.VITE_MAINNET_API 
    : import.meta.env.VITE_TESTNET_API;
  try {
    error.value = ''
    const balanceDto = {
		owner: props.walletAddress,
		collection: "GALA",
		category: "Unit",
		type: "none",
		additionalKey: "none",
		instance: "0"
    }

    const response = await axios.post(`${apiBaseUrl}/api/asset/token-contract/FetchBalances`, balanceDto);
	// TODO: more elegant checking of the balance response (0 items, locked amount, etc.)
    balance.value = response.data.Data.length > 0 ? parseFloat(response.data.Data[0].quantity) : 0
  } catch (err) {
    console.error(`Error fetching ${props.network} balance:`, err)
    error.value = `Error fetching ${props.network} balance. Please try again.`
    balance.value = null
  }
}

watch(() => props.walletAddress, fetchBalance)
watch(() => props.metamaskClient, fetchBalance)

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