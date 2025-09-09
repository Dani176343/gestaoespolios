// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'vuetify-nuxt-module'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      keycloak: {
        url: process.env.KEYCLOAK_URL || 'http://localhost:8080/auth',
        realm: process.env.KEYCLOAK_REALM || 'my-realm',
        clientId: process.env.KEYCLOAK_CLIENT_ID || 'my-client',
      },
    },
  },
  app: {
        head: {
            title: 'Gestão de espolios',
            // Manually adding the CSS link using the <head> property
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://digitalidentity.cm-abrantes.pt/style.css',
                },
            ],
        },
    },
  alias: {
    '~': './',
  },
  srcDir: './',
});
