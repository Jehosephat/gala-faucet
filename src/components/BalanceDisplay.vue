<template>
  <div class="balance-display">
    <h2>Your Balance</h2>
    <p>{{ balance }} GALA</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const balance = ref(0);

onMounted(async () => {
  // Fetch balance from backend
  // This is a placeholder, replace with actual API call
  balance.value = 100;
});
</script>

<style scoped lang="scss">
.balance-display {
  // Add your styles here
}
</style>