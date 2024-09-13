<template>
  <div class="mint-gala">
    <button @click="mintGala" class="button">Mint 10 GALA (Testnet)</button>
    <p v-if="mintMessage" :class="{ 'error': isError }">{{ mintMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { signObject } from '../../utils/signing'

const props = defineProps<{
  walletAddress: string
}>()

const emit = defineEmits(['mintSuccess'])

const mintMessage = ref('')
const isError = ref(false)

const mintGala = async () => {
  try {
    const mintAmount = 10
    const mintTokensDto = {
          owner: props.walletAddress,
          quantity: mintAmount.toString(),
          tokenClass: {
            collection: "GALA",
            category: "Unit",
            type: "none",
            additionalKey: "none"
          },
          tokenInstance: "0",
          uniqueKey: `testnet-faucet-free-mint-${Date.now()}`
        }

    // Sign with faucet admin credentials
    const signedMintTokensDto = signObject(mintTokensDto, import.meta.env.VITE_FAUCET_ADMIN_PRIVATE_KEY)
    const mintResponse = await axios.post(`${import.meta.env.VITE_TESTNET_API}/api/asset/token-contract/MintToken`, signedMintTokensDto)

    mintMessage.value = `Successfully minted ${mintAmount} GALA on testnet`
    isError.value = false
    emit('mintSuccess')
  } catch (error) {
    console.error('Error minting GALA:', error)
    mintMessage.value = 'Error minting GALA. Please try again.'
    isError.value = true
  }
}
</script>

<style scoped>
.mint-gala {
  margin-top: 20px;
}

.error {
  color: red;
}
</style>
