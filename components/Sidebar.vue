<template>
  <nav :class="['sidebar', { 'sidebar--collapsed': !isExpanded }]">
    <div class="sidebar__logo" v-if="isExpanded">
      <h1>Gestão de espolios</h1>
    </div>
    <ul class="sidebar__nav">
      <li v-for="item in navItems" :key="item.title" class="sidebar__nav-item">
        <a href="#" class="sidebar__nav-link">
          <span class="sidebar__icon">{{ item.icon }}</span>
          <span v-if="isExpanded" class="sidebar__text">{{ item.title }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

const props = defineProps({
  isExpanded: {
    type: Boolean,
    required: true
  }
});

const navItems = [
  { title: 'Dashboard', icon: '🏠' },
  { title: 'Ecommerce', icon: '🛒' },
  { title: 'Project', icon: '📁' },
  { title: 'Marketing', icon: '📢' },
  { title: 'Analytic', icon: '📊' },
  { title: 'AI', icon: '🤖' },
  { title: 'Customer', icon: '👥' },
  { title: 'Products', icon: '📦' },
  { title: 'Orders', icon: '🛍️' },
  { title: 'Account', icon: '👤' },
  { title: 'Help Center', icon: '❓' },
  { title: 'Calendar', icon: '📅' }
];
</script>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  height: 100vh;
  overflow-y: auto;
  transition: width 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.sidebar--collapsed {
  width: 60px;
}

.sidebar__logo {
  font-weight: bold;
  font-size: 1.5rem;
  padding: 0 1rem 1rem;
  border-bottom: 1px solid #ddd;
}

.sidebar__nav {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.sidebar__nav-item {
  margin: 0.5rem 0;
}

.sidebar__nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.sidebar__nav-link:hover {
  background-color: #f0f0f0;
}

.sidebar__icon {
  font-size: 1.25rem;
  width: 24px;
  display: inline-block;
  text-align: center;
  margin-right: 1rem;
}

.sidebar--collapsed .sidebar__icon {
  margin-right: 0;
}

.sidebar__text {
  white-space: nowrap;
}
</style>
