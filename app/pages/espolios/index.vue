<template>
  <div>
    <v-card>
      <!-- 1. Card Title and Actions -->
      <v-card-title>
        Gestão de Espólios
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddDialog">Adicionar Espólio</v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="espolios"
          item-value="_id"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="mr-2" @click="openEditDialog(item)">mdi-pencil</v-icon>
            <v-icon size="small" @click="openDeleteDialog(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- 2. Main Edit/Add Dialog -->
    <BaseDialog
      :is-visible="editDialog"
      :title="dialogTitle"
      width="900px"
      @update:isVisible="editDialog = $event"
      @confirmed="saveEspolio"
      confirm-button-text="Salvar"
    >
      <v-form ref="form" v-model="isFormValid">
        <v-expansion-panels v-model="panel">
          <!-- Form sections go here -->
          <v-expansion-panel title="Caraterização da organização">
            <v-expansion-panel-text>
              <v-text-field v-model="editedEspolio.organizacao.designacao" label="Designação" :rules="[rules.required]"></v-text-field>
              <v-text-field v-model="editedEspolio.organizacao.sigla" label="Sigla"></v-text-field>
              <v-text-field v-model="editedEspolio.organizacao.morada" label="Morada"></v-text-field>
              <v-text-field v-model="editedEspolio.organizacao.contactos" label="Contactos"></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Catalogação - Identificação">
            <v-expansion-panel-text>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.designacaoAcervo" label="Designação do acervo/coleção"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.entidadeProdutora" label="Entidade produtora"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.numeroInventario" label="Nº de inventário" :rules="[rules.required]"></v-text-field>
              <v-combobox v-model="editedEspolio.catalogacao.identificacao.outraNumeracao" label="Outra numeração (Fichas antigas)" multiple chips></v-combobox>
              <v-select v-model="editedEspolio.catalogacao.identificacao.nivel" :items="['peça', 'conjunto']" label="Nível"></v-select>
              <v-combobox v-model="editedEspolio.catalogacao.identificacao.nucleo" :items="['Arqueologia Romana', 'Cerâmica']" label="Núcleo" multiple chips></v-combobox>
              <v-combobox v-model="editedEspolio.catalogacao.identificacao.categoria" :items="['Património Arqueológico']" label="Categoria" multiple chips></v-combobox>
              <v-select v-model="editedEspolio.catalogacao.identificacao.tipologia" :items="['Objetos', 'imaterial']" label="Tipologia"></v-select>
              <v-combobox v-model="editedEspolio.catalogacao.identificacao.materiais" :items="['barro', 'argila']" label="Materiais" multiple chips></v-combobox>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.titulo" label="Título ou nome" :rules="[rules.required]"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.dataPeca" label="Data (cronologia) da peça"></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Catalogação - Descrição física">
            <v-expansion-panel-text>
                <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.comprimento" label="Comprimento" type="number"></v-text-field>
                <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.largura" label="Largura" type="number"></v-text-field>
                <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.altura" label="Altura" type="number"></v-text-field>
                <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.diametro.maior" label="Diâmetro maior" type="number"></v-text-field>
                <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.diametro.menor" label="Diâmetro menor" type="number"></v-text-field>
              <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.peso" label="Peso" type="number"></v-text-field>
              <v-combobox v-model="editedEspolio.catalogacao.descricaoFisica.tecnicas" label="Técnicas" multiple chips></v-combobox>
              <v-textarea v-model="editedEspolio.catalogacao.descricaoFisica.descricaoTextual" label="Descrição textual"></v-textarea>
              <v-textarea v-model="editedEspolio.catalogacao.descricaoFisica.marcasOuInscricoes" label="Marcas ou inscrições"></v-textarea>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Contexto">
            <v-expansion-panel-text>
              <v-combobox v-model="editedEspolio.catalogacao.contexto.lugares" label="Lugares" multiple chips></v-combobox>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.uso" label="Uso"></v-text-field>
              <h4>Coletor</h4>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.proveniencia.coletor.nome" label="Nome do Coletor"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.proveniencia.coletor.profissao" label="Profissão do Coletor"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.proveniencia.coletor.morada" label="Morada do Coletor"></v-text-field>
              <h4>Informador</h4>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.proveniencia.informador.nome" label="Nome do Informador"></v-text-field>
              <v-text-field v-model.number="editedEspolio.catalogacao.contexto.proveniencia.informador.idade" label="Idade do Informador" type="number"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.proveniencia.informador.profissao" label="Profissão do Informador"></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Acesso">
            <v-expansion-panel-text>
              <v-text-field v-model="editedEspolio.catalogacao.acesso.estadoConservacao" label="Estado de conservação"></v-text-field>
              <v-combobox v-model="editedEspolio.catalogacao.acesso.intervencoes" label="Intervenções (conservação e restauro)" multiple chips></v-combobox>
              <v-text-field v-model="editedEspolio.catalogacao.acesso.localizacao" label="Localização"></v-text-field>
              <v-combobox v-model="editedEspolio.catalogacao.acesso.objetosAssociados" label="Objetos associados" multiple chips></v-combobox>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Controlo da descrição">
            <v-expansion-panel-text>
              <v-combobox v-model="editedEspolio.catalogacao.controloDescricao.bibliografia" label="Bibliografia" multiple chips></v-combobox>
              <v-text-field v-model="editedEspolio.catalogacao.controloDescricao.dataRegisto" label="Data do registo" type="date"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.controloDescricao.responsavel" label="Responsável"></v-text-field>
              <v-textarea v-model="editedEspolio.catalogacao.controloDescricao.notaCatalogador" label="Nota do catalogador"></v-textarea>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Anexo">
            <v-expansion-panel-text>
                <v-img v-if="imagePreviewUrl" :src="imagePreviewUrl" max-height="300" class="mb-4"></v-img>
                <v-file-input label="Imagem" v-model="imagemFile" chips accept="image/*"></v-file-input>
                <v-text-field v-model="editedEspolio.catalogacao.anexo.imagem" label="URL da Imagem" hint="URL da imagem existente ou para onde será enviada."></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-form>
    </BaseDialog>

    <!-- 3. Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Tem a certeza que quer apagar este item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDeleteDialog">Cancelar</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="deleteEspolioConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRuntimeConfig } from '#app';
import type { VForm } from 'vuetify/lib/components/index.mjs';
import BaseDialog from '~/components/core/BaseDialog.vue';
import { useKeycloakStore } from '~/stores/keycloak';
import type { Espolio } from '~~/types/espolio';

const config = useRuntimeConfig();

const espolios = ref<Espolio[]>([]);
const editDialog = ref(false);
const deleteDialog = ref(false);
const dialogTitle = ref('');
const editedIndex = ref(-1);
const panel = ref<number | null>(0);
const form = ref<VForm | null>(null);
const isFormValid = ref(false);
const espolioToDelete = ref<Espolio | null>(null);
const keycloakStore = useKeycloakStore();

// Validation Rules
const rules = {
  required: (value: any) => !!value || 'Campo obrigatório',
};

const defaultEspolio: Espolio = {
  _id: null,
  organizacao: { designacao: '', sigla: '', morada: '', contactos: '' },
  catalogacao: {
    identificacao: {
      designacaoAcervo: '',
      entidadeProdutora: '',
      numeroInventario: '',
      outraNumeracao: [],
      nivel: 'peça',
      nucleo: [],
      categoria: [],
      tipologia: 'Objetos',
      materiais: [],
      titulo: '',
      dataPeca: ''
    },
    descricaoFisica: {
      medidas: { comprimento: null, largura: null, altura: null, diametro: { maior: null, menor: null } },
      peso: null, tecnicas: [], descricaoTextual: '', marcasOuInscricoes: ''
    },
    contexto: {
      lugares: [], uso: '',
      proveniencia: {
        coletor: { nome: '', profissao: '', morada: '' },
        informador: { nome: '', idade: null, profissao: '' },
      },
    },
    acesso: { estadoConservacao: '', intervencoes: [], localizacao: '', objetosAssociados: [] },
    controloDescricao: { bibliografia: [], dataRegisto: new Date().toISOString().substr(0, 10), responsavel: '', notaCatalogador: '' },
    anexo: { imagem: '' },
  },
};

const editedEspolio = ref<Espolio>(JSON.parse(JSON.stringify(defaultEspolio)));
const imagemFile = ref<File | File[] | null>(null);
const imagePreviewDataUrl = ref<string | null>(null);

const headers = ref([
  { title: 'Designação', key: 'organizacao.designacao' },
  { title: 'Nº Inventário', key: 'catalogacao.identificacao.numeroInventario' },
  { title: 'Título', key: 'catalogacao.identificacao.titulo' },
  { title: 'Ações', key: 'actions', sortable: false },
]);

watch(() => keycloakStore.token, (newToken) => {
  if (newToken) {
    fetchEspolios();
  }
}, { immediate: true });

watch(imagemFile, (newFile) => {
  const file = Array.isArray(newFile) ? newFile[0] : newFile;
  if (file && file instanceof File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviewDataUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreviewDataUrl.value = null;
  }
});

const imagePreviewUrl = computed(() => {
  if (imagePreviewDataUrl.value) {
    return imagePreviewDataUrl.value;
  }
  if (editedEspolio.value.catalogacao.anexo.imagem) {
    return editedEspolio.value.catalogacao.anexo.imagem;
  }
  return null;
});

// Utility Functions
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge<T extends object>(target: T, source: object): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          (output as Record<string, any>)[key] = deepMerge(
            (target as Record<string, any>)[key],
            (source as Record<string, any>)[key]
          );
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

async function fetchEspolios() {
  try {
    console.log('Fetching espolios from collection:', `${config.public.apiBaseUrl}/espolios`);
    const data = await $fetch<Espolio[]>(`${config.public.apiBaseUrl}/espolios`, {
      headers: {
        'Authorization': `Bearer ${keycloakStore.token}`
      }
    });
    console.log('Successfully fetched espolios. Data:', data);
    espolios.value = data;
  } catch (err) {
    console.error("Erro a buscar espólios:", err);
  }
}

function openAddDialog() {
  editedIndex.value = -1;
  editedEspolio.value = JSON.parse(JSON.stringify(defaultEspolio));
  imagemFile.value = null;
  imagePreviewDataUrl.value = null;
  dialogTitle.value = 'Adicionar Novo Espólio';
  editDialog.value = true;
}

function openEditDialog(item: any) {
  editedIndex.value = espolios.value.findIndex(e => e._id === item._id);
  const defaultClone = JSON.parse(JSON.stringify(defaultEspolio));
  editedEspolio.value = deepMerge(defaultClone, item);
  imagemFile.value = null;
  imagePreviewDataUrl.value = null;
  dialogTitle.value = 'Editar Espólio';
  editDialog.value = true;
}

// Helpers para navegar e setar por path (suporta índices numéricos)
function getAtPath(root: any, path: string) {
  if (!path) return undefined;
  const keys = path.split('.');
  let current = root;
  for (let i = 0; i < keys.length; i++) {
    if (current == null) return undefined;
    const k = keys[i];
    const idx = Number(k);
    if (Array.isArray(current) && !Number.isNaN(idx) && k === idx.toString()) {
      current = current[idx];
    } else if (typeof k === 'string') {
      current = current[k as keyof typeof current];
    } else {
      current = undefined;
    }
  }
  return current;
}
function setAtPath(root: any, path: string, value: any) {
  if (!path) return;
  const keys = path.split('.');
  let current = root;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current == null) return;
    const k = keys[i];
    const idx = Number(k);
    if (Array.isArray(current) && !Number.isNaN(idx) && k === idx.toString()) {
      current = current[idx];
    } else if (typeof k === 'string' && current !== undefined) {
      current = (current as Record<string, unknown>)[k];
    } else {
      current = undefined;
    }
  }
  if (current == null) return;
  const last = keys[keys.length - 1];
  const lastIdx = Number(last);
  if (Array.isArray(current) && !Number.isNaN(lastIdx)) {
    current[lastIdx] = value;
  } else {
    if (typeof last === 'string') {
      current[last as keyof typeof current] = value;
    }
  }
}

// 2. Sanitize data (aplica as transformações)
function sanitizeEspolioForSaving(espolio: Espolio): Espolio {
  const cleanEspolio: any = JSON.parse(JSON.stringify(espolio));

  const numericPaths = [
    'catalogacao.descricaoFisica.medidas.comprimento',
    'catalogacao.descricaoFisica.medidas.largura',
    'catalogacao.descricaoFisica.medidas.altura',
    'catalogacao.descricaoFisica.medidas.diametro.maior',
    'catalogacao.descricaoFisica.medidas.diametro.menor',
    'catalogacao.descricaoFisica.peso',
    'catalogacao.contexto.proveniencia.informador.idade'
  ];

  for (const p of numericPaths) {
    const val = getAtPath(cleanEspolio, p);
    // Convert empty strings to null
    if (val === '') {
      setAtPath(cleanEspolio, p, null);
      continue;
    }
    // If it's a string that looks numeric, coerce to number
    if (typeof val === 'string') {
      const n = Number(val);
      setAtPath(cleanEspolio, p, Number.isNaN(n) ? null : n);
      continue;
    }
    // If it's already a number or null, keep as-is
  }

  return cleanEspolio as Espolio;
}

async function saveEspolio() {
  if (!form.value) return;

  const { valid } = await form.value.validate();
  if (!valid) return;

  const espolioToSave = sanitizeEspolioForSaving(editedEspolio.value);

  const formData = new FormData();
  formData.append('espolio', JSON.stringify(espolioToSave));

  // The v-file-input can return an array or a single file.
  const file = Array.isArray(imagemFile.value) ? imagemFile.value[0] : imagemFile.value;
  if (file) {
    formData.append('imagem', file);
  }

  const fetchHeaders = new Headers();
  fetchHeaders.append('Authorization', `Bearer ${keycloakStore.token}`);

  if (editedIndex.value > -1) {
    // Update
    try {
      if (!espolioToSave._id) {
        console.error('Espólio sem _id não pode ser atualizado');
        return;
      }
      const updatedEspolio = await $fetch<Espolio>(`${config.public.apiBaseUrl}/espolios/${encodeURIComponent(espolioToSave._id)}`, {
        method: 'PUT',
        body: formData,
        headers: fetchHeaders,
      });
      if (updatedEspolio) {
        espolios.value[editedIndex.value] = updatedEspolio;
      }
    } catch (error) {
      console.error("Erro ao atualizar espólio:", error);
    }
  } else {
    // Create
    try {
      const newEspolio = await $fetch<Espolio>(`${config.public.apiBaseUrl}/espolios`, {
        method: 'POST',
        body: formData,
        headers: fetchHeaders,
      });
      if (newEspolio) {
        espolios.value.push(newEspolio);
      }
    } catch (error) {
      console.error("Erro ao criar espólio:", error);
    }
  }
  editDialog.value = false;
  imagemFile.value = null; // Reset file input
}

function openDeleteDialog(item: Espolio) {
  espolioToDelete.value = item;
  deleteDialog.value = true;
}

function closeDeleteDialog() {
  espolioToDelete.value = null;
  deleteDialog.value = false;
}

async function deleteEspolioConfirm() {
  if (!espolioToDelete.value || !espolioToDelete.value._id) return;

  try {
    await $fetch<void>(`${config.public.apiBaseUrl}/espolios/${encodeURIComponent(espolioToDelete.value._id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${keycloakStore.token}`
      }
    });
    espolios.value = espolios.value.filter(e => e._id !== espolioToDelete.value?._id);
  } catch (error) {
    console.error("Erro ao apagar espólio:", error);
  }
  closeDeleteDialog();
}
</script>

<style scoped>
.v-expansion-panel-text__wrapper {
  padding: 16px;
}
h4 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
</style>