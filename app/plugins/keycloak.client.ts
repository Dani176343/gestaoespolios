import { useKeycloakStore } from '~/stores/keycloak';

export default defineNuxtPlugin(async (nuxtApp) => {
  const keycloakStore = useKeycloakStore(nuxtApp.$pinia as any);

  if (process.client) {
    await keycloakStore.init();
  }
});
