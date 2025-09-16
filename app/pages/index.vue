<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="text-center">Welcome</v-card-title>
          <v-card-text>
            <p>This is the home page.</p>
            <ClientOnly>
              <p v-if="keycloakStore.authenticated">You are authenticated.</p>
              <p v-else>You are not authenticated.</p>
              <v-btn v-if="!keycloakStore.authenticated" @click="login" color="primary">Login</v-btn>
              <v-btn v-if="keycloakStore.authenticated" @click="logout" color="secondary">Logout</v-btn>
            </ClientOnly>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useKeycloakStore } from '~/stores/keycloak';

const keycloakStore = useKeycloakStore();

const login = () => {
  keycloakStore.login();
};

const logout = () => {
  keycloakStore.logout();
};
</script>
