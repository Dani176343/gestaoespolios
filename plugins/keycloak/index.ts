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
      const accessTokenCookie = useCookie('kc_access_token');
      const refreshTokenCookie = useCookie('kc_refresh_token');
      const idTokenCookie = useCookie('kc_id_token');

      const initOptions: Keycloak.KeycloakInitOptions = {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: silentCheckUri,
        checkLoginIframe: true,
        flow: 'standard',
        enableLogging: true,
      };

      if (accessTokenCookie.value && refreshTokenCookie.value && idTokenCookie.value) {
        initOptions.token = accessTokenCookie.value;
        initOptions.refreshToken = refreshTokenCookie.value;
        initOptions.idToken = idTokenCookie.value;
        console.log('Initializing Keycloak with tokens from cookies.');
      } else {
        console.log('No Keycloak tokens found in cookies. Initializing without them.');
      }

      const initPromise = keycloak.init(initOptions);
      initPromise.then(() => console.log('Keycloak init promise resolved.')).catch(e => console.error('Keycloak init promise rejected:', e));
      
      await initPromise;
      console.log('Keycloak init completed or timed out. Authenticated:', keycloak.authenticated);
      console.log('Keycloak token:', keycloak.token);
      console.log('Keycloak refreshToken:', keycloak.refreshToken);
      console.log('Keycloak userInfo:', keycloak.userInfo);

      keycloakStore.setKeycloak(keycloak); // Set Keycloak instance in store early

      if (keycloak.authenticated) {
        await keycloak.loadUserInfo();
        // Re-enabled token refresh. Investigate 400 error if it persists.
        await keycloakStore.updateToken();
        console.log('User info loaded and Pinia store updated. Authenticated:', keycloakStore.authenticated);
        console.log('Pinia store token:', keycloakStore.token);
        console.log('Pinia store userInfo:', keycloakStore.userInfo);

        // More aggressive URL hash cleanup
        if (window.location.hash.includes('state=') || window.location.hash.includes('session_state=') || window.location.hash.includes('code=')) {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          console.log('URL hash cleaned.');
        }
      } else {
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
