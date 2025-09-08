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
    setKeycloak(keycloak: any) {
      this.keycloak = keycloak;
      this.authenticated = keycloak.authenticated;
      this.token = keycloak.token;
      this.userInfo = keycloak.userInfo;
    },

    login() {
      console.log('Keycloak store login action called.');
      if (this.keycloak) {
        console.log('Keycloak instance exists. Authenticated:', (this.keycloak as any).authenticated);
        (this.keycloak as any).login();
      }
    },

    logout() {
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
