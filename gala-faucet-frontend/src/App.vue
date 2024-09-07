<template>
  <div id="app">
    <h1>Gala Faucet</h1>
    <WalletConnect />
    <BalanceDisplay />
    <MintForm />
  </div>
</template>

<script setup lang="ts">
import WalletConnect from './components/WalletConnect.vue';
import BalanceDisplay from './components/BalanceDisplay.vue';
import MintForm from './components/MintForm.vue';
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
