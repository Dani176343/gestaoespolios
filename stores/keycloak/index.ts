import { defineStore } from 'pinia';
import { useCookie } from '#app';

export const useKeycloakStore = defineStore('keycloak', {
  state: () => {
    // Initialize authenticated state directly from the cookie
    const loggedInCookie = process.client ? useCookie('logged_in') : null;
    return {
      keycloak: null,
      authenticated: loggedInCookie ? loggedInCookie.value === 'true' : false,
      token: null,
      userInfo: null,
      isKeycloakReady: false,
    };
  },

  actions: {
    setKeycloak(keycloak: any) {
      console.log('setKeycloak called');
      this.keycloak = keycloak;
      this.token = keycloak.token;
      this.userInfo = keycloak.userInfo;

      if (process.client) {
        const loggedInCookie = useCookie('logged_in', { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }); // 7 days expiration
        const accessTokenCookie = useCookie('kc_access_token', { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        const refreshTokenCookie = useCookie('kc_refresh_token', { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        const idTokenCookie = useCookie('kc_id_token', { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

        console.log('Initial loggedInCookie.value:', loggedInCookie.value);

        if (keycloak.authenticated) {
          this.authenticated = true;
          loggedInCookie.value = 'true';
          accessTokenCookie.value = keycloak.token;
          refreshTokenCookie.value = keycloak.refreshToken;
          idTokenCookie.value = keycloak.idToken;
          console.log('Keycloak authenticated. Setting loggedInCookie to true. New value:', loggedInCookie.value);
        } else if (loggedInCookie.value === 'true') {
          this.authenticated = true;
          console.log('Authenticated by cookie. Setting authenticated to true.');
        } else {
          this.authenticated = false;
          // Do NOT clear the cookie here. It should only be cleared on explicit logout.
          // loggedInCookie.value = null;
          // accessTokenCookie.value = null;
          // refreshTokenCookie.value = null;
          // idTokenCookie.value = null;
          console.log('Not authenticated by Keycloak, but not clearing cookie yet.');
        }
      }
    },

    login() {
      console.log('Keycloak store login action called.');
      if (this.keycloak) {
        console.log('Keycloak instance exists. Authenticated:', (this.keycloak as any).authenticated);
        (this.keycloak as any).login();
      }
    },

    logout() {
      console.log('logout action called.');
      // Clear the logged_in cookie on logout
      if (process.client) {
        const loggedInCookie = useCookie('logged_in', { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        const accessTokenCookie = useCookie('kc_access_token', { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        const refreshTokenCookie = useCookie('kc_refresh_token', { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        const idTokenCookie = useCookie('kc_id_token', { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

        console.log('Clearing logged_in cookie on logout. Initial value:', loggedInCookie.value);
        loggedInCookie.value = null;
        accessTokenCookie.value = null;
        refreshTokenCookie.value = null;
        idTokenCookie.value = null;
        console.log('loggedInCookie after clearing:', loggedInCookie.value);
      }
      if (this.keycloak) {
        (this.keycloak as any).logout();
      }
      
    },

    async updateToken() {
      try {
        await (this.keycloak as any).updateToken(5);
        this.setKeycloak(this.keycloak);
      } catch (error) {
        console.error('Failed to refresh token', error);
      }
    },
  },
});
