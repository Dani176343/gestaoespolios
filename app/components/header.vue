<template>
  <header class="header">
    <button :class="['header__menu-btn', { 'sidebar-open': !isSidebarExpanded }]" @click="$emit('toggle-sidebar')" aria-label="Toggle sidebar">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    <div class="header__actions">
      <div class="header__profile" @click="toggleDropdown" tabindex="0" @blur="closeDropdown" @keydown.esc="closeDropdown" role="button" aria-haspopup="true">
        <img :src="userAvatar" alt="User Avatar" class="header__avatar" />
        <div v-if="isDropdownOpen" class="header__dropdown" @mousedown.prevent>
          <div class="header__dropdown-header">
            <img :src="userAvatar" alt="User Avatar" class="header__dropdown-avatar" />
            <div class="header__dropdown-userinfo">
              <strong v-if="keycloakStore.authenticated">{{ keycloakStore.userInfo?.name }}</strong>
              <strong v-else>Guest</strong>
              <span v-if="keycloakStore.authenticated">{{ keycloakStore.userInfo?.email }}</span>
              <span v-else>Please login</span>
            </div>
          </div>
          <ul class="header__dropdown-menu">
            <li v-if="keycloakStore.authenticated">
              <NuxtLink to="/profile" class="header__dropdown-item">
                <i class="icon-user-line"></i>
                Profile
              </NuxtLink>
            </li>
            <li v-if="keycloakStore.authenticated" class="header__dropdown-divider"></li>
            <li>
              <button v-if="keycloakStore.authenticated" @click="keycloakStore.logout" class="header__dropdown-item">
                <i class="icon-logout-box-r-line"></i>
                Sign Out
              </button>
              <button v-else @click="keycloakStore.login" class="header__dropdown-item">
                <i class="icon-login-box-line"></i>
                Sign In
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useKeycloakStore } from '../stores/keycloak';

const props = defineProps({
  isSidebarExpanded: {
    type: Boolean,
    required: true
  }
});

const keycloakStore = useKeycloakStore();
const isDropdownOpen = ref(false);

const userAvatar = computed(() => {
  return keycloakStore.userInfo?.picture || '/images/img_user_profile.png';
});

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function closeDropdown() {
  isDropdownOpen.value = false;
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 1.5rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

.header__menu-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease, transform 0.3s ease;
}

.header__menu-btn.sidebar-open {
  background-color: #e0e0e0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.header__menu-btn:hover {
  background: #e0e0e0;
}

.header__search {
  flex-grow: 1;
  max-width: 480px;
  display: flex;
  align-items: center;
  position: relative;
}

.header__search input {
  width: 100%;
  padding: 0.5rem 3rem 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.header__search input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
}

.header__search-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  color: #409eff;
  transition: color 0.2s ease;
}

.header__search-btn:hover {
  color: #1a73e8;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
}

.header__action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  color: #666;
  transition: color 0.2s ease;
}

.header__action-btn:hover {
  color: #409eff;
}

.header__flag-emoji {
  font-size: 1.25rem;
}

.header__avatar-placeholder {
  font-size: 1.5rem;
  cursor: pointer;
}

.header__profile {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.header__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.header__dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  width: 240px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
  padding: 1rem;
  z-index: 1000;
  user-select: none;
}

.header__dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.header__dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.header__dropdown-userinfo {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #333;
}

.header__dropdown-userinfo strong {
  font-weight: 600;
  font-size: 1rem;
}

.header__dropdown-userinfo span {
  font-size: 0.8rem;
  color: #666;
}

.header__dropdown-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.header__dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  text-decoration: none;
}

.header__dropdown-item i {
  font-size: 1.2rem;
  color: #666;
}

.header__dropdown-item:hover {
  background-color: #f0f0f0;
}

.header__dropdown-divider {
  height: 1px;
  background-color: #ddd;
  margin: 0.5rem 0;
}
</style>
