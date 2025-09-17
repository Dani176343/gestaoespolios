<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="text-center">Bem-vindo</v-card-title>
          <v-card-text>
            <p>Esta é a pagina inicial</p>
            <ClientOnly>
              <p v-if="keycloakStore.authenticated">Voce está autenticado</p>
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

const logout = () => {
  keycloakStore.logout();
};
</script>
