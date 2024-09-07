<template>
  <div id="app">
    <Balance />
    <BurnGala />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Balance from './components/Balance.vue'
import BurnGala from './components/BurnGala.vue'

export default defineComponent({
  name: 'App',
  components: {
    Balance,
    BurnGala
  }
})
</script>
