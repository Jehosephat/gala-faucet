<template>
  <div class="wallet-connect">
    <button @click="connectWallet" v-if="!isConnected" class="button">Connect Wallet</button>
    <div v-else>
      <p class="wallet-address">Connected: {{ truncatedAddress }}</p>
      <button @click="registerUser" v-if="!isRegistered" class="button">Register</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MetamaskConnectClient } from '@gala-chain/connect'
import axios from 'axios'
import { ethers } from 'ethers'

const metamaskClient = new MetamaskConnectClient();
const isConnected = ref(false)
const walletAddress = ref('')
const isRegistered = ref(false)

// Define emits at the top level of the script setup
const emit = defineEmits(['registrationComplete'])

const truncatedAddress = computed(() => {
  if (walletAddress.value.length > 10) {
    return walletAddress.value
    // return `${walletAddress.value.slice(0, 6)}...${walletAddress.value.slice(-4)}`
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
    await checkRegistration()
  } catch (err) {
    console.error('Error connecting wallet:', err)
  }
}

const checkRegistration = async () => {
  try {
    console.log('walletAddress.value', walletAddress.value)
    const response = await axios.post(`${import.meta.env.VITE_BURN_GATEWAY_PUBLIC_KEY_API}/GetPublicKey`, {
      user: walletAddress.value
    })
    const response2 = await axios.post(`${import.meta.env.VITE_FAUCET_GATEWAY_PUBLIC_KEY_API}/GetPublicKey`, {
      user: walletAddress.value
    })
    console.log(response2.data.Data)
    isRegistered.value = !!response.data.Data
  } catch (err) {
    // not really an error, just means the user is not registered yet
    console.error('User is not registered', err)
    isRegistered.value = false
  }
}

const registerUser = async () => {
  try {
    const publicKey = await metamaskClient.getPublicKey()
    console.log('publicKey', publicKey)
    const registerDto = {
      publicKey: publicKey.publicKey
    }
    
    const adminPrivateKey = import.meta.env.VITE_FAUCET_ADMIN_PRIVATE_KEY
    const adminWallet = new ethers.Wallet(adminPrivateKey)
    const signature = await adminWallet.signMessage(registerDto.publicKey)
    const faucetPayload = { 
      ...registerDto, 
      signature
    }
    const mainnetRegistration = axios.post(
      `${import.meta.env.VITE_GALASWAP_API}/CreateHeadlessWallet`,
      registerDto
    )
    const faucetRegistration = axios.post(
      `${import.meta.env.VITE_FAUCET_GATEWAY_PUBLIC_KEY_API}/RegisterEthUser`,
      faucetPayload
    )
    await Promise.all([mainnetRegistration, faucetRegistration])
    isRegistered.value = true
    emit('registrationComplete')
  } catch (err) {
    console.error('Error registering user:', err)
  }
}

defineExpose({ isConnected, metamaskClient, walletAddress, isRegistered })
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
