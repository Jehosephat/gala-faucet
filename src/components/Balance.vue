<template>
  <div class="balance">
    <h3>{{ networkName }} Balance</h3>
    <p class="balance-amount">{{ balance }} GALA</p>
    <p v-if="lockedBalance > 0" class="locked-balance">
      ({{ lockedBalance }} GALA locked)
    </p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { MetamaskConnectClient } from '@gala-chain/connect'
import { tokenConfig } from '../config/tokens';

const props = defineProps<{
  network: 'mainnet' | 'testnet'
  walletAddress: string
  metamaskClient: MetamaskConnectClient | null
}>()

const balance = ref<number | null>(null)
const lockedBalance = ref<number>(0)
const error = ref('')

const networkName = computed(() => props.network === 'mainnet' ? 'Mainnet' : 'Testnet')

const fetchBalance = async () => {
  if (!props.walletAddress || !props.metamaskClient) return

  const apiBaseUrl = props.network === 'mainnet' 
    ? import.meta.env.VITE_BURN_GATEWAY_API
    : import.meta.env.VITE_FAUCET_GATEWAY_API;

  try {
    error.value = ''
    const balanceDto = {
      owner: props.walletAddress,
      ...tokenConfig[props.network]
    }

    const response = await axios.post(`${apiBaseUrl}/FetchBalances`, balanceDto);
    console.log(response.data.Data[0])
    
    if (response.data.Data.length > 0) {
      balance.value = parseFloat(response.data.Data[0].quantity)
      
      lockedBalance.value = response.data.Data[0].lockedHolds.reduce(
        (acc: number, hold: any) => acc + parseFloat(hold.quantity), 
        0
      );
    } else {
      balance.value = 0
      lockedBalance.value = 0
    }

    console.log(`Locked quantity: ${lockedBalance.value}`)
  } catch (err) {
    console.error(`Error fetching ${props.network} balance:`, err)
    error.value = `Error fetching ${props.network} balance. Please try again.`
    balance.value = null
    lockedBalance.value = 0
  }
}

watch(() => props.walletAddress, fetchBalance)
watch(() => props.metamaskClient, fetchBalance)

onMounted(fetchBalance)

defineExpose({ fetchBalance, balance })
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

.locked-balance {
  font-size: 0.9em;
  color: #888;
  margin-top: 5px;
}

.error {
  color: #ff4d4d;
  margin-top: 10px;
}
</style>