<template>
  <div v-if="loading" class="loading-spinner">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);
</script>

<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
</style>
