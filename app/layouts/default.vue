<template>
  <div class="layout-container">
    <Sidebar :isExpanded="!isSidebarExpanded" />
    <div class="main-container">
      <Header :isSidebarExpanded="isSidebarExpanded" @toggle-sidebar="toggleSidebar" />
      <main class="main-content">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '../components/header.vue';
import Sidebar from '../components/Sidebar.vue';

const isSidebarExpanded = ref(true);

function toggleSidebar() {
  isSidebarExpanded.value = !isSidebarExpanded.value;
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
}

.main-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  transition: margin-left 0.3s ease;
  margin-left: 240px; /* Default sidebar width */
}

.layout-container:has(.sidebar--collapsed) .main-container {
  margin-left: 60px; /* Collapsed sidebar width */
}

.main-content {
  flex-grow: 1;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
