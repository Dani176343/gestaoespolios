<template>
  <v-row class="ma-0 pa-0">
    <v-col cols="12" md="6" class="m-0 pa-0">
      <BaseContainer title="">
        <v-card class="pa-4" flat elevation="0" height="283">
          <v-row>
            <!-- Avatar -->
            <v-col cols="12" md="auto" class="d-flex justify-center align-center mb-4 mb-md-0">
              <div style="position: relative; width: 200px; height: 200px;">
                <v-avatar size="200" color="grey lighten-2">
                  <v-img :src="previewUrl || profilePhotoUrl || '/images/img_user_profile.png'" />
                </v-avatar>
                <!-- 
                <!- Hidden file input ->
                <input ref="fileInputRef" type="file" accept="image/*" class="d-none" @change="onFileChange" />

                <!- Ícone da câmera ->
                <div @click="triggerFileInput" class="icon-photo-div">
                  <v-icon icon="mdi-camera" size="24" color="white" />
                </div> -->
              </div>
            </v-col>

            <!-- Informações do usuário -->
            <v-col cols="12" md class="d-flex flex-column justify-center text-start">
              <div class="text-subtitle-1 info-user-name">
                {{ fullName }}
              </div>
              <div class="text-subtitle-1 info-user-info">
                <span>Organização:</span>
                {{ keycloakStore.userOrganization }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </BaseContainer>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BaseContainer from '~/components/core/BaseContainer.vue';
import { useKeycloakStore } from '../../stores/keycloak';

const keycloakStore = useKeycloakStore();

const fileInputRef = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

const fullName = computed(() => {
  if (keycloakStore.userInfo?.name) {
    return `${keycloakStore.userInfo.name}`;
  }
  return keycloakStore.userInfo?.preferred_username || '';
});

const profilePhotoUrl = computed(() => {
  return keycloakStore.userInfo?.picture;
});

function triggerFileInput() {
  fileInputRef.value?.click();
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
}

onMounted(() => {
  console.log("Access Token:", keycloakStore.keycloak?.token);
  const base64Url = keycloakStore.keycloak?.token?.split('.')[1];
  if (base64Url) {
    const payload = JSON.parse(atob(base64Url));
    console.log("Decoded Token Payload:", payload);
    console.log("Orgs1:", payload.orgs);
  }
  console.log("Orgs2:", keycloakStore.keycloak?.tokenParsed?.orgs);
  console.log("keycloakStore.userInfo onMounted:", keycloakStore.userInfo);
  console.log("keycloakStore.keycloak?.tokenParsed onMounted:", keycloakStore.keycloak?.tokenParsed);
});

</script>

<style scoped>
.info-user-name {
  font-size: 24px !important;
  font-weight: bold;
  color: #1D2A3B;
}

.info-user-info {
  font-size: 18px !important;
  color: rgba(128, 128, 128, 0.99);
}

.info-user-info span {
  font-size: 18px !important;
  color: #1D2A3B;
}

.info-title {
  font-size: 20px;
  font-weight: 500;
  color: #1D2A3B;
}

.info-title-subtitle {
  font-size: 16px;
  color: #1D2A3B;
}

.flex-grow-1 p span {
  font-weight: 500;
  color: #1D2A3B;
}

.flex-grow-1 p {
  color: rgba(128, 128, 128, 0.99);
}

.icon-photo-div {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #24579e;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.d-none {
  display: none;
}
</style>