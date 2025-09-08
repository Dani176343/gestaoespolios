<template>
  <v-app>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
import { useKeycloakStore } from '../stores/keycloak';
import { onMounted } from 'vue';

const { $keycloak } = useNuxtApp();
const keycloakStore = useKeycloakStore();

onMounted(() => {
  if ($keycloak) {
    keycloakStore.setKeycloak($keycloak);
  }
});
</script>
