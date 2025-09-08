<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="text-center">Test Page</v-card-title>
          <v-card-text>
            <p>This is a protected page.</p>
            <p v-if="keycloakStore.authenticated">You are authenticated and can see this page.</p>
            <p>User Info: {{ keycloakStore.userInfo }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useKeycloakStore } from '../stores/keycloak';

definePageMeta({
  middleware: 'auth',
});

const keycloakStore = useKeycloakStore();
</script>
