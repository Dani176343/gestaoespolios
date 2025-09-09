<template>
  <v-dialog
      v-model="isDialogVisible"
      max-width="90%"
      :width="width"
      @update:model-value="handleDialogClose"
  >
    <v-card>
      <v-card-title class="headline mt-2 ml-1 title-cor">
        <i v-if="icon" :class="icon" class="mr-2 text-subtitle-1"></i>
        <span>{{ title }}</span>

        <!-- Close button in the top-right corner -->
        <v-btn
            icon
            variant="text"
            class="close-btn"
            @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text   class="px-6 pt-5 pb-5" style="overflow-y: auto; ">
        <!-- Default content slot for notification details -->
        <slot></slot>
      </v-card-text>
      <v-divider class="pa-1"></v-divider>
      <v-card-actions class="mb-1 mr-2">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="buttonColor" @click="closeDialog">Fechar</v-btn>
        <v-btn v-if="confirmButton" variant="flat" color="buttonColor" @click="confirmDialog">{{ confirmButtonText }}</v-btn>
        <v-btn v-if="isSigning" variant="flat" color="buttonColor" @click="signStore.startUp">Assinar</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: "Sem título",
    required: true
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  isSigning: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  },
  width: {
    type: String,
    default: '700px'
  },
  confirmButtonText: {
    type: String,
    default: 'Marcar como lida'
  },
  confirmButton: {
    type: Boolean,
    default: true
  },
});

const emit = defineEmits(['update:isVisible', 'confirmed','closed']);

const isDialogVisible = ref(props.isVisible);


const closeDialog = () => {
  emit('update:isVisible', false);
  emit('closed');
};


const confirmDialog = () => {
  emit('update:isVisible', false);
  emit('confirmed');
};


const handleDialogClose = (newValue: boolean) => {
  if (!newValue) {
    emit('update:isVisible', false);
  }
};


watch(() => props.isVisible, (newVal) => {
  isDialogVisible.value = newVal;
});
</script>

<style scoped>
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.title-cor {
  color: #475569;
}
</style>