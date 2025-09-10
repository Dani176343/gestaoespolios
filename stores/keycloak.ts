import { defineStore } from 'pinia';
import Keycloak from 'keycloak-js';
import type { UserInfo } from '../types/keycloak';

export const useKeycloakStore = defineStore('keycloak', {
  state: () => ({
    keycloak: null as Keycloak | null,
    authenticated: false,
    userInfo: null as UserInfo | null,
    token: null as string | null,
  }),

  actions: {
    async init() {
      const config = useRuntimeConfig();
      const keycloak = new Keycloak({
        url: config.public.keycloak.url,
        realm: config.public.keycloak.realm,
        clientId: config.public.keycloak.clientId,
      });

      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        });

        this.keycloak = keycloak;
        this.authenticated = authenticated;

        if (authenticated) {
          this.userInfo = await keycloak.loadUserInfo() as UserInfo;
          this.token = keycloak.token;
        }
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
      }
    },

    login() {
      this.keycloak?.login();
    },

    logout() {
      this.keycloak?.logout({ redirectUri: window.location.origin });
    },

    async refreshToken() {
      try {
        const refreshed = await this.keycloak?.updateToken(5);
        if (refreshed) {
          this.token = this.keycloak?.token;
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    },
  },
});
