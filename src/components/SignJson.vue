<template>
  <div class="sign-json">
    <textarea v-model="jsonInput" placeholder="Paste JSON object here" class="large-text-box"></textarea>
    <textarea v-model="privateKey" placeholder="Paste private key here" class="small-text-box"></textarea>
    <button @click="signJson" :disabled="!jsonInput || !privateKey" class="button">Sign JSON</button>
    <textarea v-model="signedJson" placeholder="Signed JSON will appear here" class="large-text-box" readonly></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signObject } from '../../utils/signing'

const jsonInput = ref('')
const privateKey = ref('')
const signedJson = ref('')



const signJson = () => {
  try {
    const jsonObject = JSON.parse(jsonInput.value)
    const signedObject = signObject(jsonObject, privateKey.value)
    signedJson.value = JSON.stringify(signedObject, null, 2)
  } catch (error) {
    console.error('Error signing JSON:', error)
    signedJson.value = 'Error signing JSON. Please check your input.'
  }
}
</script>

<style scoped>
.sign-json {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.large-text-box {
  width: 100%;
  height: 150px;
}

.small-text-box {
  width: 100%;
  height: 50px;
}

.button {
  align-self: flex-start;
}
</style>
