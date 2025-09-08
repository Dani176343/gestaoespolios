import Keycloak from 'keycloak-js';
import { useKeycloakStore } from '../../stores/keycloak';

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  const keycloak = new Keycloak({
    url: config.public.keycloak.url,
    realm: config.public.keycloak.realm,
    clientId: config.public.keycloak.clientId,
  });

  if (process.client) {
    const keycloakStore = useKeycloakStore();
    try {
      console.log('Keycloak init started.');
      const initPromise = keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
      });
      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log('Keycloak init timeout, assuming not authenticated');
          resolve();
        }, 5000);
      });
      await Promise.race([initPromise, timeoutPromise]);
      console.log('Keycloak init completed or timed out. Authenticated:', keycloak.authenticated);
      keycloakStore.setKeycloak(keycloak);
      console.log('Pinia store updated after init. Authenticated:', keycloakStore.authenticated);

      if (keycloak.authenticated) {
        await keycloak.loadUserInfo();
        keycloakStore.setKeycloak(keycloak);
        console.log('User info loaded and Pinia store updated. Authenticated:', keycloakStore.authenticated);

        // Re-enabled token refresh. Investigate 400 error if it persists.
        await keycloakStore.updateToken();

        // More aggressive URL hash cleanup
        if (window.location.hash.includes('state=') || window.location.hash.includes('session_state=') || window.location.hash.includes('code=')) {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          console.log('URL hash cleaned.');
        }
      }
      keycloakStore.isKeycloakReady = true;
      console.log('Keycloak store is now ready.');
    } catch (error) {
      console.error('Failed to initialize Keycloak', error);
      const keycloakStore = useKeycloakStore();
      keycloakStore.isKeycloakReady = true;
    }
  }

  nuxtApp.provide('keycloak', keycloak);
});
