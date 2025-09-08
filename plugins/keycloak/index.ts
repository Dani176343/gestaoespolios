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
      const silentCheckUri = window.location.origin + '/silent-check-sso.html';
      console.log('Silent Check SSO Redirect URI:', silentCheckUri);
      const initPromise = keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: silentCheckUri,
      });
      initPromise.then(() => console.log('Keycloak init promise resolved.')).catch(e => console.error('Keycloak init promise rejected:', e));
      
      await initPromise;
      console.log('Keycloak init completed or timed out. Authenticated:', keycloak.authenticated);
      console.log('Keycloak token:', keycloak.token);
      console.log('Keycloak refreshToken:', keycloak.refreshToken);
      console.log('Keycloak userInfo:', keycloak.userInfo);

      if (keycloak.authenticated) {
        await keycloak.loadUserInfo();
        // Re-enabled token refresh. Investigate 400 error if it persists.
        await keycloakStore.updateToken();
        keycloakStore.setKeycloak(keycloak);
        console.log('User info loaded and Pinia store updated. Authenticated:', keycloakStore.authenticated);
        console.log('Pinia store token:', keycloakStore.token);
        console.log('Pinia store userInfo:', keycloakStore.userInfo);

        // More aggressive URL hash cleanup
        if (window.location.hash.includes('state=') || window.location.hash.includes('session_state=') || window.location.hash.includes('code=')) {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          console.log('URL hash cleaned.');
        }
      } else {
        keycloakStore.setKeycloak(keycloak);
        console.log('Pinia store updated after init. Authenticated:', keycloakStore.authenticated);
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
