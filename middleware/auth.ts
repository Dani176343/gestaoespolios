import { useKeycloakStore } from '~/stores/keycloak';

export default defineNuxtRouteMiddleware((to, from) => {
  const keycloakStore = useKeycloakStore();

  // Log the organization from the store during route changes
  console.log('Auth middleware check. User organization:', keycloakStore.userOrganization);

  if (!keycloakStore.authenticated) {
    // Only redirect if not trying to access the root page, to avoid a redirect loop
    if (to.path !== '/') {
      console.log('User not authenticated. Redirecting to login.');
      return navigateTo('/'); 
    }
  }
});