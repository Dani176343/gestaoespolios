<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-center">Login</v-card-title>
          <v-card-text>
            <v-btn @click="login" color="primary" block>Login with Keycloak</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useKeycloakStore } from '../../stores/keycloak';
import { watch } from 'vue';

const keycloakStore = useKeycloakStore();

const login = () => {
  keycloakStore.login();
};

// Watch for authentication state change
watch(() => keycloakStore.authenticated, (newVal) => {
  if (newVal) {
    navigateTo('/');
  }
});
</script>
