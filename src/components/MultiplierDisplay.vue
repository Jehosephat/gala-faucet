<template>
    <div class="multiplier-display">
      <h3>Faucet Multiplier</h3>
      <p v-if="burnAmount == 0">1 Mainnet GALA = {{ multiplier }} Testnet GALA</p>
      <p v-if="burnAmount > 0">
        {{ burnAmount }} Mainnet GALA = {{ mintAmount }} Testnet GALA
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps<{
    multiplier: number
    burnAmount: number
  }>()
  
  const mintAmount = computed(() => props.burnAmount * props.multiplier)
  </script>
  
  <style scoped>
  .multiplier-display {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  h3 {
    color: var(--primary-color);
    margin-bottom: 10px;
  }
  </style>