import { defineStore } from 'pinia';

export const useKeycloakStore = defineStore('keycloak', {
  state: () => ({
    keycloak: null,
    authenticated: false,
    token: null,
    userInfo: null,
    isKeycloakReady: false,
  }),

  actions: {
    setKeycloak(keycloak) {
      this.keycloak = keycloak;
      this.authenticated = keycloak.authenticated;
      this.token = keycloak.token;
      this.userInfo = keycloak.userInfo;
    },

    login() {
      this.keycloak.login();
    },

    logout() {
      this.keycloak.logout();
    },

    async updateToken() {
      try {
        await this.keycloak.updateToken(5);
        this.setKeycloak(this.keycloak);
      } catch (error) {
        console.error('Failed to refresh token', error);
      }
    },
  },
});
