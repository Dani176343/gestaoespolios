import { useKeycloakStore } from "@/stores/keycloak";
import { useCookie } from '#app';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const keycloakStore = useKeycloakStore();

  //console.log('Auth middleware (global): Waiting for Keycloak to be ready...');

  if (!keycloakStore.isKeycloakReady) {
    try {
      await Promise.race([
        new Promise<void>(resolve => {
          const unwatch = keycloakStore.$subscribe((mutation, state) => {
            if (state.isKeycloakReady) {
              unwatch();
              resolve();
            }
          });
        }),
        new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Keycloak readiness timeout'));
          }, 1000); // 1 seconds timeout
        })
      ]);
      console.log('Auth middleware (global): Keycloak is ready. Authenticated:', keycloakStore.authenticated);
    } catch (error) {
      //console.error('Auth middleware (global): Keycloak readiness check failed or timed out:', error);
      // If Keycloak is not ready after timeout, redirect to login
      if (to.path !== '/login') {
        //console.log('Auth middleware (global): Redirecting to /login due to Keycloak readiness timeout.');
        //return navigateTo('/login');
      }
    }
  } else {
    //console.log('Auth middleware (global): Keycloak was already ready. Authenticated:', keycloakStore.authenticated);
  }

  if (process.client) {
    console.log('process.client is true');
    if (!keycloakStore.authenticated) {
      console.log('Auth middleware (global): Not authenticated. Checking logged_in cookie...');
      const loggedInCookie = useCookie<boolean | null>('logged_in');
      console.log('loggedInCookie: ', loggedInCookie.value);
      if (loggedInCookie.value === true) {
        console.log('Auth middleware (global): Authenticated by cookie. Setting authenticated to true.');
        keycloakStore.login();
      }
    }
  }

  //console.log('Auth middleware (global): Navigating to:', to.path);
  //console.log('Auth middleware (global): Current authenticated state:', keycloakStore.authenticated);

  if (keycloakStore.authenticated && to.path === '/login') {
    // console.log('Auth middleware (global): Authenticated and on login page. Redirecting to /');
     return navigateTo('/');
  }
});
