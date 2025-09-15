<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-h5 text-center mb-4">Criar Coleção para a Organização</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="createCollection">
          <p class="text-center mb-4">
            A coleção será criada com o nome da sua organização.
          </p>
          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
          >
            Criar Coleção
          </v-btn>
        </v-form>
        
        <v-alert
          v-if="alertMessage"
          :type="alertType"
          class="mt-6"
          closable
        >
          {{ alertMessage }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useKeycloakStore } from '~/stores/keycloak';

definePageMeta({
  middleware: ['auth'] 
});

const keycloakStore = useKeycloakStore();
const alertMessage = ref('');
const alertType = ref('');

async function createCollection() {
  alertMessage.value = '';

  if (!keycloakStore.authenticated || !keycloakStore.token) {
    alertMessage.value = 'Utilizador não autenticado. Por favor, inicie sessão.';
    alertType.value = 'error';
    return;
  }

  try {
    const config = useRuntimeConfig();
    
    // O backend não precisa mais de um corpo de requisição, pois a coleção será
    // nomeada apenas com a organização.
    const response = await $fetch(`${config.public.apiBaseUrl}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloakStore.token}`
      }
    });

    alertMessage.value = response.message;
    alertType.value = 'success';
  } catch (error) {
    console.error('Erro ao criar coleção:', error);
    alertMessage.value = `Erro: ${error.data?.message || 'Ocorreu um erro desconhecido ao criar a coleção.'}`;
    alertType.value = 'error';
  }
}
</script>