<template>
  <div class="generate-key-pair">
    <button @click="generateKeyPair" class="button">Generate Key Pair</button>
    <label for="publicKey">Public Key:</label>
    <textarea id="publicKey" v-model="publicKey" placeholder="Public Key" class="large-text-box" readonly></textarea>
    <label for="privateKey">Private Key:</label>
    <textarea id="privateKey" v-model="privateKey" placeholder="Private Key" class="large-text-box" readonly></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ec as EC } from 'elliptic'

const ecSecp256k1 = new EC('secp256k1')

const publicKey = ref('')
const privateKey = ref('')

const generateKeyPair = () => {
  const keyPair = ecSecp256k1.genKeyPair()
  publicKey.value = keyPair.getPublic('hex')
  privateKey.value = keyPair.getPrivate('hex')
}
</script>

<style scoped>
.generate-key-pair {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.large-text-box {
  width: 100%;
  height: 50px;
}

.button {
  align-self: flex-start;
}
</style>
