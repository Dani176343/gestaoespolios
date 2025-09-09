<template>
  <v-container fluid>
    <v-card class="custom-card">
      <div class="header d-flex justify-space-between">
        <h2>{{ title }}</h2>

        <!-- ✅ Um único botão -->
        <div v-if="actions.length === 1">
          <v-btn
              icon
              flat
              class="ml-2"
              @click="actions[0].onClick"
          >
            <i v-if="actions[0].icon" :class="actions[0].icon" style="font-size: 20px" />
            {{ actions[0].label }}
          </v-btn>
        </div>

        <!-- ✅ Menu para várias ações -->
        <v-menu v-else-if="actions.length > 1" location="bottom end">
          <template #activator="{ props }">
            <v-btn icon v-bind="props" flat>
              <i class="mdi mdi-dots-vertical" style="font-size: 25px" />
            </v-btn>
          </template>

          <v-list>
            <v-list-item
                v-for="(action, index) in actions"
                :key="index"
                @click="action.onClick"
            >
              <v-list-item-title class="d-flex align-center">
                <i v-if="action.icon" :class="action.icon" class="mr-2" />
                {{ action.label }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <LoadingSpinner />

      <div class="content">
        <slot></slot>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import LoadingSpinner from "../components/core/LoadingSpinner.vue";


const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  actions: {
    type: Array,
    default: () => []
    // expected format: [{ label: 'Mark all as read', icon: 'mdi-email-open-outline', onClick: () => {} }]
  }
})


</script>

<style scoped>


.custom-card{
  padding: 10px;
  border: rgba(236,232,236,0.99) 1px solid;
  box-shadow: 0 0 28px -10px rgba(0,0,0,0.3);
}

.header {
  margin-bottom: 15px;
  margin-left: 2px;
  font-size: 0.9rem;
}
.header h2 {
  font-weight: normal;
}

.content {
  text-align: center;
}

</style>