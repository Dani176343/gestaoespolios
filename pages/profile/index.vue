<template>
  <v-row class="ma-0 pa-0">
    <v-col cols="12" md="6" class="m-0 pa-0">
      <BaseContainer title="">
        <v-card class="pa-4" flat elevation="0" height="283">
          <v-row>
            <!-- Avatar -->
            <v-col
                cols="12"
                md="auto"
                class="d-flex justify-center align-center mb-4 mb-md-0">
              <div style="position: relative; width: 200px; height: 200px;">
                <v-avatar size="200" color="grey lighten-2">
                  <v-img :src="profilePhotoUrl || '/images/img_user_profile.png'" />
                </v-avatar>

                <!-- Hidden file input -->
                <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    class="d-none"
                    @change="onFileChange"
                />

                <!-- Ícone da câmera -->
                <div
                    @click="triggerFileInput"
                    class="icon-photo-div">
                 <v-icon icon="mdi-camera" size="24" color="white" />
                </div>
              </div>
            </v-col>

            <!-- Informações do usuário -->
            <v-col cols="12" md class="d-flex flex-column justify-center text-start">
              <div class="text-subtitle-1 info-user-name">
                {{ keycloakStore.userInfo?.fullName }}
              </div>
              <div class="text-subtitle-1 info-user-info">
                <span>Email:</span> {{ keycloakStore.userInfo?.email }}
              </div>
              <div class="text-subtitle-1 info-user-info">
                <span>Número de funcionário:</span> {{ keycloakStore.userInfo?.employeeId }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </BaseContainer>
    </v-col>

    <v-col cols="12" md="6" class="m-0 pa-0">
      <BaseContainer title="">
        <v-card class="d-flex align-center" flat elevation="0">
          <v-col class="ml-4 text-start">
            <!-- Container flex para título e botão -->
            <div class="d-flex align-center justify-space-between">
              <span class="info-title">Dados profissionais</span>
            </div>

            <v-divider class="mt-3 mb-3"/>

            <div
                class="text-subtitle-1 font-weight-medium d-flex flex-wrap"
                style="gap: 2rem;"
            >
              <!-- Coluna Morada -->
              <div class="flex-grow-1" style="min-width: 250px;">
                <div class="info-title-subtitle mt-2 primary-color-global">Morada</div>
                <p><span>Rua: </span>{{ keycloakStore.userInfo?.userProfessionalAddress.street }}</p>
                <p><span>Número: </span>{{ keycloakStore.userInfo?.userProfessionalAddress.number }}</p>
                <p><span>Lado: </span>{{ keycloakStore.userInfo?.userProfessionalAddress.side }}</p>
                <p><span>Código Postal: </span>{{ keycloakStore.userInfo?.userProfessionalAddress.postalCode }}</p>
                <p><span>Localidade: </span>{{ keycloakStore.userInfo?.userProfessionalAddress.locality }}</p>
                <p><span>Concelhos: </span>{{ keycloakStore.userInfo?.userProfessionalAddress.municipality }}</p>
              </div>

              <!-- Coluna Contactos -->
              <div class="flex-grow-1" style="min-width: 250px;">
                <div class="info-title-subtitle mt-2 primary-color-global">Contactos</div>
                <p><span>E-mail: </span>{{ keycloakStore.userInfo?.userProfessionalAddress.email }}</p>
                <p><span>Telemóvel: </span>{{ keycloakStore.userInfo?.userProfessionalAddress.cellphone }}</p>
              </div>
            </div>
          </v-col>
        </v-card>
      </BaseContainer>
    </v-col>
  </v-row>

  <BaseContainer title="">
    <v-card class="d-flex align-center" flat elevation="0">
      <v-col class="ml-4 text-start">
        <!-- Container flex para título e botão -->
        <div class="d-flex align-center justify-space-between">
          <span class="info-title">Dados Pessoais</span>
          <v-btn
              color="primary"
              variant="flat"
              @click="openDialog()">Editar</v-btn>
        </div>

        <v-divider class="mt-3 mb-3"/>

        <div
            class="text-subtitle-1 font-weight-medium d-flex flex-wrap"
            style="gap: 2rem;">
          <!-- Coluna Morada -->
          <div class="flex-grow-1" style="min-width: 250px;">
            <div class="info-title-subtitle mt-2 primary-color-global">Morada</div>
            <p><span>Rua: </span>{{ keycloakStore.userInfo?.userPersonalAddress.street }}</p>
            <p><span>Número: </span>{{ keycloakStore.userInfo?.userPersonalAddress.number }}</p>
            <p><span>Lado: </span>{{ keycloakStore.userInfo?.userPersonalAddress.side }}</p>
            <p><span>Código Postal: </span>{{ keycloakStore.userInfo?.userPersonalAddress.postalCode }}</p>
            <p><span>Localidade: </span>{{ keycloakStore.userInfo?.userPersonalAddress.locality }}</p>
            <p><span>Concelhos: </span>{{ keycloakStore.userInfo?.userPersonalAddress.municipality }}</p>
          </div>

          <!-- Coluna Contactos -->
          <div class="flex-grow-1" style="min-width: 250px;">
            <div class="info-title-subtitle mt-2 primary-color-global">Contactos</div>
            <p><span>E-mail: </span>{{ keycloakStore.userInfo?.userPersonalAddress.email }}</p>
            <p><span>Telemóvel: </span>{{ keycloakStore.userInfo?.userPersonalAddress.cellphone }}</p>
          </div>
        </div>
      </v-col>
    </v-card>
  </BaseContainer>

  <BaseDialog
      title="Alterar dados pessoais"
      icon="icon-user-line"
      v-model:isVisible="isDialogVisible"
      @confirmed="submitForm"
      width="60%"
      confirmButtonText="Alterar dados"
  >
    <template #default>
        <v-form @submit.prevent="submitForm" ref="formRef" v-model="isValid">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.rua"
                  label="Rua"
                  required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.numero"
                  type="number"
                  label="numero"
                  required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.lado"
                  label="Lado"
                  required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.localidade"
                  label="Localidade"
                  required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.concelho"
                  label="Concelho"
                  required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.email"
                  label="E-mail"
                  required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.telemovel"
                  label="Telemóvel"
                  required
              />
            </v-col>

          </v-row>
        </v-form>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import BaseContainer from '../../components/core/BaseContainer.vue';
import BaseDialog from '../../components/core/BaseDialog.vue';
import { useKeycloakStore } from '../../stores/keycloak';

const keycloakStore = useKeycloakStore();

const isDialogVisible = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

// Initial form state (replace with values from store if needed)
const form = reactive({
  rua: '',
  numero: '',
  lado: '',
  codigoPostal: '',
  localidade: '',
  concelho: '',
  email: '',
  telemovel: '',
});

const isValid = ref(false);
const formRef = ref();

const fullName = computed(() => {
  if (keycloakStore.userInfo?.given_name && keycloakStore.userInfo?.family_name) {
    return `${keycloakStore.userInfo.given_name} ${keycloakStore.userInfo.family_name}`;
  }
  return keycloakStore.userInfo?.preferred_username || '';
});

const profilePhotoUrl = computed(() => {
  return null;
});

async function submitForm() {
  if (formRef.value?.validate()) {
    console.log('Form submitted:', form);
    isDialogVisible.value = false;
  }
}

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

function openDialog() {}

onMounted(async () => {
  if (keycloakStore.userInfo?.preferred_username) {
    
  }
});

</script>

<style scoped>

.info-user-name {
  font-size: 24px !important;
  font-weight: bold;
  color: #1D2A3B;
}

.info-user-info{
  font-size: 18px !important;
  color: rgba(128,128,128,0.99);
}

.info-user-info span{
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

.flex-grow-1 p  {
  color: rgba(128,128,128,0.99);
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