<template>
  <div>
    <v-card>
      <!-- 1. Card Title and Actions -->
      <v-card-title>
        Gestão de Espólios
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
          <v-btn color="primary" @click="openAddDialog" class="mr-2">Adicionar Espólio</v-btn>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Procurar" hide-details
            variant="outlined" density="compact"></v-text-field>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="filteredEspolios" item-value="_id" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="mr-2" @click="openViewImageDialog(item)"
              :disabled="!item.catalogacao.anexos || item.catalogacao.anexos.length === 0">mdi-eye</v-icon>
            <v-icon size="small" class="mr-2" @click="openEditDialog(item)">mdi-pencil</v-icon>
            <v-icon size="small" @click="openDeleteDialog(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- 2. Main Edit/Add Dialog -->
    <BaseDialog :is-visible="editDialog" :title="dialogTitle" width="900px" @update:isVisible="editDialog = $event"
      @confirmed="saveEspolio" confirm-button-text="Salvar">
      <v-form ref="form" v-model="isFormValid">
        <v-expansion-panels v-model="panel">
          <!-- Form sections go here -->
          <v-expansion-panel title="Caraterização da organização">
            <v-expansion-panel-text>
              <v-text-field v-model="editedEspolio.organizacao.designacao" label="Designação"
                :rules="[rules.required]"></v-text-field>
              <v-text-field v-model="editedEspolio.organizacao.sigla" label="Sigla"></v-text-field>
              <v-text-field v-model="editedEspolio.organizacao.morada" label="Morada"></v-text-field>
              <v-text-field v-model="editedEspolio.organizacao.contactos" label="Contactos"></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Catalogação - Identificação">
            <v-expansion-panel-text>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.designacaoAcervo"
                label="Designação do acervo/coleção"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.entidadeProdutora"
                label="Entidade produtora"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.numeroInventario" label="Nº de inventário"
                :rules="[rules.required]"></v-text-field>
              <v-combobox v-model="editedEspolio.catalogacao.identificacao.outraNumeracao"
                label="Outra numeração (Fichas antigas)" multiple chips></v-combobox>
              <v-select v-model="editedEspolio.catalogacao.identificacao.nivel" :items="['peça', 'conjunto']"
                label="Nível"></v-select>
              <v-combobox v-model="editedEspolio.catalogacao.identificacao.nucleo"
                :items="['Linho']" label="Núcleo" multiple chips></v-combobox>
              <v-combobox v-model="editedEspolio.catalogacao.identificacao.categoria"
                :items="['Património Arqueológico']" label="Categoria" multiple chips></v-combobox>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.tipologia" label="Tipologia"
                clearable></v-text-field>
              <v-combobox v-model="editedEspolio.catalogacao.identificacao.materiais" :items="['barro', 'argila']"
                label="Materiais" multiple chips></v-combobox>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.titulo" label="Título ou nome"
                :rules="[rules.required]"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.dataPeca"
                label="Data (cronologia) da peça"></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Catalogação - Descrição física">
            <v-expansion-panel-text>
              <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.comprimento"
                label="Comprimento" type="number"></v-text-field>
              <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.largura" label="Largura"
                type="number"></v-text-field>
              <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.altura" label="Altura"
                type="number"></v-text-field>
              <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.diametro.maior"
                label="Diâmetro maior" type="number"></v-text-field>
              <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.diametro.menor"
                label="Diâmetro menor" type="number"></v-text-field>
              <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.peso" label="Peso"
                type="number"></v-text-field>
              <v-combobox v-model="editedEspolio.catalogacao.descricaoFisica.tecnicas" label="Técnicas" multiple
                chips></v-combobox>
              <v-textarea v-model="editedEspolio.catalogacao.descricaoFisica.descricaoTextual"
                label="Descrição textual"></v-textarea>
              <v-textarea v-model="editedEspolio.catalogacao.descricaoFisica.marcasOuInscricoes"
                label="Marcas ou inscrições"></v-textarea>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Contexto">
            <v-expansion-panel-text>
              <v-combobox v-model="editedEspolio.catalogacao.contexto.lugares" label="Lugares" multiple
                chips></v-combobox>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.uso" label="Uso"></v-text-field>
              <h4>Coletor</h4>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.proveniencia.coletor.nome"
                label="Nome do Coletor"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.proveniencia.coletor.profissao"
                label="Profissão do Coletor"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.proveniencia.coletor.morada"
                label="Morada do Coletor"></v-text-field>
              <h4>Informador</h4>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.proveniencia.informador.nome"
                label="Nome do Informador"></v-text-field>
              <v-text-field v-model.number="editedEspolio.catalogacao.contexto.proveniencia.informador.idade"
                label="Idade do Informador" type="number"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.contexto.proveniencia.informador.profissao"
                label="Profissão do Informador"></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Acesso">
            <v-expansion-panel-text>
              <v-text-field v-model="editedEspolio.catalogacao.acesso.estadoConservacao"
                label="Estado de conservação"></v-text-field>
              <v-combobox v-model="editedEspolio.catalogacao.acesso.intervencoes"
                label="Intervenções (conservação e restauro)" multiple chips></v-combobox>
              <v-text-field v-model="editedEspolio.catalogacao.acesso.localizacao" label="Localização"></v-text-field>
              <v-combobox v-model="editedEspolio.catalogacao.acesso.objetosAssociados" label="Objetos associados"
                multiple chips></v-combobox>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Controlo da descrição">
            <v-expansion-panel-text>
              <v-combobox v-model="editedEspolio.catalogacao.controloDescricao.bibliografia" label="Bibliografia"
                multiple chips></v-combobox>
              <v-text-field v-model="editedEspolio.catalogacao.controloDescricao.dataRegisto" label="Data do registo"
                type="date"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.controloDescricao.responsavel"
                label="Responsável"></v-text-field>
              <v-textarea v-model="editedEspolio.catalogacao.controloDescricao.notaCatalogador"
                label="Nota do catalogador"></v-textarea>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Anexos">
            <v-expansion-panel-text>
              <v-expansion-panels>
                <v-expansion-panel v-for="(anexo, index) in editedEspolio.catalogacao.anexos" :key="index"
                  :title="`Imagem ${index + 1}`">
                  <v-expansion-panel-text>
                    <v-img :src="getImagePreviewUrl(index) || ''" max-height="300" class="mb-4"></v-img>
                    <v-file-input label="Imagem" :model-value="imagemFiles[index]"
                      @update:model-value="handleFileChange(index, $event)" accept="image/*"></v-file-input>
                    <v-text-field v-model="anexo.imagem" label="URL da Imagem"
                      hint="URL da imagem existente ou para onde será enviada."></v-text-field>
                    <v-btn color="error" @click="removeAnexo(index)">Remover Imagem</v-btn>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-btn color="primary" @click="addAnexo" class="mt-4">Adicionar Imagem</v-btn>
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

    <!-- View Image Dialog -->
    <v-dialog v-model="viewImageDialog" max-width="90vw">
      <div class="view-dialog-wrapper">
        <v-btn class="view-dialog-close" icon @click.stop="viewImageDialog = false" aria-label="Fechar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-carousel v-if="carouselItems.length" show-arrows="hover" hide-delimiters style="width: 100%; height: 100%;">
          <v-carousel-item v-for="(image, i) in carouselItems" :key="i">
            <v-img :src="image" class="view-dialog-img" contain @click="viewImageDialog = false" role="button"
              tabindex="0" @keydown.enter="viewImageDialog = false"></v-img>
          </v-carousel-item>
        </v-carousel>
      </div>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">Fechar</v-btn>
      </template>
    </v-snackbar>

    <!-- Loader -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRuntimeConfig } from '#app';
import type { VForm } from 'vuetify/components';
import BaseDialog from '@/components/core/BaseDialog.vue';
import { useKeycloakStore } from '~/stores/keycloak';
import type { Espolio } from '~~/types/espolio';

const config = useRuntimeConfig();

const espolios = ref<Espolio[]>([]);
const editDialog = ref(false);
const deleteDialog = ref(false);
const viewImageDialog = ref(false);
const imageUrl = ref('');
const dialogTitle = ref('');
const editedIndex = ref(-1);
const panel = ref<(number | string)[] | null>([0]);
const form = ref<VForm | null>(null);
const isFormValid = ref(false);
const espolioToDelete = ref<Espolio | null>(null);
const keycloakStore = useKeycloakStore();
const search = ref('');
const loading = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('');
const carouselItems = ref<string[]>([]);

const filteredEspolios = computed(() => {
  if (!search.value) {
    return espolios.value;
  }
  return espolios.value.filter(espolio => {
    const searchTerm = search.value.toLowerCase();
    return (
      espolio.organizacao.designacao.toLowerCase().includes(searchTerm) ||
      espolio.catalogacao.identificacao.numeroInventario.toLowerCase().includes(searchTerm) ||
      espolio.catalogacao.identificacao.titulo.toLowerCase().includes(searchTerm)
    );
  });
});

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
      tipologia: '',
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
    anexos: [],
  },
};

const editedEspolio = ref<Espolio>(JSON.parse(JSON.stringify(defaultEspolio)));
const imagemFiles = ref<(File | null)[]>([]);
const imagePreviewDataUrls = ref<(string | null)[]>([]);

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

function handleFileChange(index: number, fileOrFiles: File | File[] | null) {
  // Accepts File, File[] or null. If array, use first file.
  let file: File | null = null;
  if (Array.isArray(fileOrFiles)) {
    file = fileOrFiles.length > 0 ? (fileOrFiles[0] ?? null) : null;
  } else {
    file = fileOrFiles;
  }
  imagemFiles.value[index] = file;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviewDataUrls.value[index] = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreviewDataUrls.value[index] = null;
  }
}

const getImagePreviewUrl = (index: number) => {
  if (imagePreviewDataUrls.value[index]) {
    return imagePreviewDataUrls.value[index];
  }
  if (editedEspolio.value.catalogacao.anexos && editedEspolio.value.catalogacao.anexos[index]?.imagem) {
    return editedEspolio.value.catalogacao.anexos[index].imagem;
  }
  return null;
};

function addAnexo() {
  editedEspolio.value.catalogacao.anexos.push({ imagem: '' });
  imagemFiles.value.push(null);
  imagePreviewDataUrls.value.push(null);
}

function removeAnexo(index: number) {
  editedEspolio.value.catalogacao.anexos.splice(index, 1);
  imagemFiles.value.splice(index, 1);
  imagePreviewDataUrls.value.splice(index, 1);
}

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


// Campos que são combobox / multi
const PREDEFINED_MULTI_FIELDS = [
  'catalogacao.identificacao.outraNumeracao',
  'catalogacao.identificacao.nucleo',
  'catalogacao.identificacao.categoria',
  'catalogacao.identificacao.materiais',
  'catalogacao.descricaoFisica.tecnicas',
  'catalogacao.contexto.lugares',
  'catalogacao.acesso.intervencoes',
  'catalogacao.acesso.objetosAssociados',
  'catalogacao.controloDescricao.bibliografia',
];

// Campos que são single selects / campos de data simples
const PREDEFINED_SINGLE_FIELDS = [
  'catalogacao.identificacao.nivel',
  'catalogacao.identificacao.tipologia',
  'catalogacao.controloDescricao.dataRegisto',
  'catalogacao.identificacao.dataPeca'
];

function isMultiField(path?: string) {
  if (!path) return false;
  return PREDEFINED_MULTI_FIELDS.some(p => p.toLowerCase() === path.toLowerCase());
}
function isSingleField(path?: string) {
  if (!path) return false;
  return PREDEFINED_SINGLE_FIELDS.some(p => p.toLowerCase() === path.toLowerCase());
}
function splitListString(str: string) {
  return str
    .split(/;|,/)
    .map(s => s.trim())
    .filter(Boolean);
}

function parseExcelValueToInternal(value: any, targetPath?: string) {
  if (value == null) return null;

  if (Array.isArray(value)) {
    if (isMultiField(targetPath)) {
      return value.map(v => (typeof v === 'string' ? v.trim() : v)).filter(Boolean);
    }
    return value;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;

    if (isMultiField(targetPath)) {
      return splitListString(trimmed);
    }

    if (isSingleField(targetPath)) {
      return trimmed;
    }

    if (targetPath && /medidas|peso|idade|diametro|comprimento|largura|altura/i.test(targetPath)) {
      const n = Number(trimmed.replace(',', '.'));
      return Number.isNaN(n) ? trimmed : n;
    }

    if (targetPath && /anexos|imagem/i.test(targetPath)) {
      const parts = splitListString(trimmed);
      return parts.map(p => ({ imagem: p }));
    }

    if (trimmed.includes(';')) {
      return splitListString(trimmed);
    }

    const maybeNum = Number(trimmed.replace(',', '.'));
    if (!Number.isNaN(maybeNum) && /^\s*-?\d+(\.\d+)?\s*$/.test(trimmed.replace(',', '.'))) {
      return maybeNum;
    }

    return trimmed;
  }

  return value;
}

// Percorre um espolio (ou objecto similar) e normaliza campos predefinidos que sejam strings vindas do Excel
function normalizeEspolioFields(obj: any) {
  if (!obj || typeof obj !== 'object') return;
  const numericPaths = [
    'catalogacao.descricaoFisica.medidas.comprimento',
    'catalogacao.descricaoFisica.medidas.largura',
    'catalogacao.descricaoFisica.medidas.altura',
    'catalogacao.descricaoFisica.medidas.diametro.maior',
    'catalogacao.descricaoFisica.medidas.diametro.menor',
    'catalogacao.descricaoFisica.peso',
    'catalogacao.contexto.proveniencia.informador.idade'
  ];

  // normaliza multi fields
  PREDEFINED_MULTI_FIELDS.forEach(path => {
    const val = getAtPath(obj, path);
    if (val != null && typeof val === 'string') {
      const parsed = parseExcelValueToInternal(val, path);
      setAtPath(obj, path, parsed);
    }
  });

  // normaliza single fields
  PREDEFINED_SINGLE_FIELDS.forEach(path => {
    const val = getAtPath(obj, path);
    if (val != null && typeof val === 'string') {
      const parsed = parseExcelValueToInternal(val, path);
      setAtPath(obj, path, parsed);
    }
  });

  // numeric paths
  numericPaths.forEach(path => {
    const val = getAtPath(obj, path);
    if (val === '') {
      setAtPath(obj, path, null);
    } else if (typeof val === 'string') {
      const n = Number(val.replace(',', '.'));
      setAtPath(obj, path, Number.isNaN(n) ? val : n);
    }
  });

  // anexos: se for string com urls separados -> transformar
  const anexosVal = getAtPath(obj, 'catalogacao.anexos');
  if (typeof anexosVal === 'string') {
    const parsed = parseExcelValueToInternal(anexosVal, 'catalogacao.anexos');
    if (Array.isArray(parsed)) {
      setAtPath(obj, 'catalogacao.anexos', parsed);
    }
  }

  // também lida com caso em que imagens estão em campo específico (ex.: 'imagem' na raiz)
  if (obj.imagem && typeof obj.imagem === 'string') {
    const parsed = parseExcelValueToInternal(obj.imagem, 'catalogacao.anexos');
    if (Array.isArray(parsed)) {
      const existing = getAtPath(obj, 'catalogacao.anexos') || [];
      setAtPath(obj, 'catalogacao.anexos', existing.concat(parsed));
    } else if (typeof parsed === 'object' && parsed.imagem) {
      const existing = getAtPath(obj, 'catalogacao.anexos') || [];
      existing.push(parsed);
      setAtPath(obj, 'catalogacao.anexos', existing);
    }
  }
}

/* ------------------------------
  FIM: Normalização
  ------------------------------ */

async function fetchEspolios() {
  loading.value = true;
  try {
    console.log('Fetching espolios from collection:', `${config.public.apiBaseUrl}/espolios`);
    const data = await $fetch<any[]>(`${config.public.apiBaseUrl}/espolios`, {
      headers: {
        'Authorization': `Bearer ${keycloakStore.token}`
      }
    });
    console.log('Successfully fetched espolios. Data:', data);

    // Normaliza cada item (aceita tanto já-estruturado quanto strings vindas do Excel)
    const normalized = data.map(item => {
      // clonamos para não mutar resposta original
      const clone = JSON.parse(JSON.stringify(item));
      // tenta normalizar campos internos (se houver)
      normalizeEspolioFields(clone);
      return clone as Espolio;
    });

    espolios.value = normalized;
  } catch (err) {
    console.error("Erro a buscar espólios:", err);
    snackbarText.value = 'Erro ao buscar espólios';
    snackbarColor.value = 'error';
    snackbar.value = true;
  } finally {
    loading.value = false;
  }
}

function openAddDialog() {
  editedIndex.value = -1;
  editedEspolio.value = JSON.parse(JSON.stringify(defaultEspolio));
  imagemFiles.value = [];
  imagePreviewDataUrls.value = [];
  dialogTitle.value = 'Adicionar Novo Espólio';
  editDialog.value = true;
}

function openEditDialog(item: any) {
  editedIndex.value = espolios.value.findIndex(e => e._id === item._id);

  // Garantir que strings vindas do Excel (nos campos predefinidos) se tornam arrays/números
  const itemClone = JSON.parse(JSON.stringify(item));
  normalizeEspolioFields(itemClone);

  const defaultClone = JSON.parse(JSON.stringify(defaultEspolio));
  editedEspolio.value = deepMerge(defaultClone, itemClone);
  if (!editedEspolio.value.catalogacao.anexos) {
    editedEspolio.value.catalogacao.anexos = [];
  }
  imagemFiles.value = Array(editedEspolio.value.catalogacao.anexos.length).fill(null);
  imagePreviewDataUrls.value = Array(editedEspolio.value.catalogacao.anexos.length).fill(null);
  dialogTitle.value = 'Editar Espólio';
  editDialog.value = true;
}

function openViewImageDialog(item: Espolio) {
  if (item.catalogacao?.anexos?.length > 0) {
    carouselItems.value = item.catalogacao.anexos.map(anexo => anexo.imagem).filter((img): img is string => !!img);
    viewImageDialog.value = true;
  }
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

  loading.value = true;
  const espolioToSave = sanitizeEspolioForSaving(editedEspolio.value);

  const formData = new FormData();
  formData.append('espolio', JSON.stringify(espolioToSave));

  imagemFiles.value.forEach((file, index) => {
    if (file) {
      formData.append(`imagem_${index}`, file);
    }
  });

  const fetchHeaders = new Headers();
  fetchHeaders.append('Authorization', `Bearer ${keycloakStore.token}`);

  try {
    if (editedIndex.value > -1) {
      // Update
      if (!espolioToSave._id) {
        console.error('Espólio sem _id não pode ser atualizado');
        return;
      }
      const updatedEspolio = await $fetch<Espolio>(`${config.public.apiBaseUrl}/espolios/${encodeURIComponent(espolioToSave._id!)}`, {
        method: 'PUT',
        body: formData,
        headers: fetchHeaders,
      });
      if (updatedEspolio) {
        espolios.value[editedIndex.value] = updatedEspolio;
        snackbarText.value = 'Espólio atualizado com sucesso!';
        snackbarColor.value = 'success';
      }
    } else {
      // Create
      const newEspolio = await $fetch<Espolio>(`${config.public.apiBaseUrl}/espolios`, {
        method: 'POST',
        body: formData,
        headers: fetchHeaders,
      });
      if (newEspolio) {
        espolios.value.push(newEspolio);
        snackbarText.value = 'Espólio criado com sucesso!';
        snackbarColor.value = 'success';
      }
    }
  } catch (error) {
    console.error("Erro ao salvar espólio:", error);
    snackbarText.value = 'Erro ao salvar espólio';
    snackbarColor.value = 'error';
  } finally {
    loading.value = false;
    snackbar.value = true;
    editDialog.value = false;
    imagemFiles.value = [];
  }
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
  loading.value = true;
  try {
    await $fetch<void>(`${config.public.apiBaseUrl}/espolios/${encodeURIComponent(espolioToDelete.value._id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${keycloakStore.token}`
      }
    });
    espolios.value = espolios.value.filter(e => e._id !== espolioToDelete.value?._id);
    snackbarText.value = 'Espólio apagado com sucesso!';
    snackbarColor.value = 'success';
  } catch (error) {
    console.error("Erro ao apagar espólio:", error);
    snackbarText.value = 'Erro ao apagar espólio';
    snackbarColor.value = 'error';
  } finally {
    loading.value = false;
    snackbar.value = true;
    closeDeleteDialog();
  }
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

.view-dialog-wrapper {
  position: relative;
  display: inline-block;
  max-width: 90vw;
}

.view-dialog-close {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 20;
  background: rgba(255, 255, 255, 0.78);
}

.view-dialog-img {
  display: block;
  max-width: 100%;
  max-height: 90vh;
}
</style>
