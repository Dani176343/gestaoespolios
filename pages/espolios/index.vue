<template>
  <div>
    <v-card>
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
            <v-icon size="small" class="mr-2" @click="openEditDialog(item as Espolio)">mdi-pencil</v-icon>
            <v-icon size="small" @click="openDeleteDialog(item as Espolio)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Main Edit/Add Dialog -->
    <BaseDialog
      :is-visible="editDialog"
      :title="dialogTitle"
      width="900px"
      @update:isVisible="editDialog = $event"
      @confirmed="saveEspolio"
      confirm-button-text="Salvar"
    >
      <v-form ref="form" v-model="isFormValid">
        <v-expansion-panels v-model="panel" multiple>
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
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.nInventario" label="Nº de inventário" :rules="[rules.required]"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.outraNumeracao" label="Outra numeração (Fichas antigas)"></v-text-field>
              <v-select v-model="editedEspolio.catalogacao.identificacao.nivel" :items="['peça', 'conjunto']" label="Nível"></v-select>
              <v-select v-model="editedEspolio.catalogacao.identificacao.nucleo" :items="['Núcleo A', 'Núcleo B']" label="Núcleo"></v-select>
              <v-select v-model="editedEspolio.catalogacao.identificacao.categoria" :items="['Categoria A', 'Categoria B']" label="Categoria"></v-select>
              <v-select v-model="editedEspolio.catalogacao.identificacao.tipologia" :items="['Objetos', 'imaterial']" label="Tipologia"></v-select>
              <v-select v-model="editedEspolio.catalogacao.identificacao.materiais" :items="['Material A', 'Material B']" label="Materiais" multiple chips></v-select>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.titulo" label="Título ou nome" :rules="[rules.required]"></v-text-field>
              <v-text-field v-model="editedEspolio.catalogacao.identificacao.dataPeca" label="Data (cronologia) da peça"></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Catalogação - Descrição física">
            <v-expansion-panel-text>
                <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.comprimento" label="Comprimento" type="number"></v-text-field>
                <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.largura" label="Largura" type="number"></v-text-field>
                <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.altura" label="Altura" type="number"></v-text-field>
                <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.diametroMaior" label="Diâmetro maior" type="number"></v-text-field>
                <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.medidas.diametroMenor" label="Diâmetro menor" type="number"></v-text-field>
              <v-text-field v-model.number="editedEspolio.catalogacao.descricaoFisica.peso" label="Peso" type="number"></v-text-field>
              <v-textarea v-model="editedEspolio.catalogacao.descricaoFisica.tecnicas" label="Técnicas"></v-textarea>
              <v-textarea v-model="editedEspolio.catalogacao.descricaoFisica.descricaoTextual" label="Descrição textual"></v-textarea>
              <v-textarea v-model="editedEspolio.catalogacao.descricaoFisica.marcasInscricoes" label="Marcas ou inscrições"></v-textarea>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Contexto">
            <v-expansion-panel-text>
              <v-text-field v-model="editedEspolio.contexto.lugares" label="Lugares"></v-text-field>
              <v-text-field v-model="editedEspolio.contexto.uso" label="Uso"></v-text-field>
              <h4>Coletor</h4>
              <v-text-field v-model="editedEspolio.contexto.proveniencia.coletor.nome" label="Nome do Coletor"></v-text-field>
              <v-text-field v-model="editedEspolio.contexto.proveniencia.coletor.profissao" label="Profissão do Coletor"></v-text-field>
              <v-text-field v-model="editedEspolio.contexto.proveniencia.coletor.morada" label="Morada do Coletor"></v-text-field>
              <h4>Informador</h4>
              <v-text-field v-model="editedEspolio.contexto.proveniencia.informador.nome" label="Nome do Informador"></v-text-field>
              <v-text-field v-model.number="editedEspolio.contexto.proveniencia.informador.idade" label="Idade do Informador" type="number"></v-text-field>
              <v-text-field v-model="editedEspolio.contexto.proveniencia.informador.profissao" label="Profissão do Informador"></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Acesso">
            <v-expansion-panel-text>
              <v-text-field v-model="editedEspolio.acesso.estadoConservacao" label="Estado de conservação"></v-text-field>
              <v-textarea v-model="editedEspolio.acesso.intervencoes" label="Intervenções (conservação e restauro)"></v-textarea>
              <v-text-field v-model="editedEspolio.acesso.localizacao" label="Localização"></v-text-field>
              <v-text-field v-model="editedEspolio.acesso.objetosAssociados" label="Objetos associados"></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Controlo da descrição">
            <v-expansion-panel-text>
              <v-textarea v-model="editedEspolio.controloDescricao.bibliografia" label="Bibliografia"></v-textarea>
              <v-text-field v-model="editedEspolio.controloDescricao.dataRegisto" label="Data do registo" type="date"></v-text-field>
              <v-text-field v-model="editedEspolio.controloDescricao.responsavel" label="Responsável"></v-text-field>
              <v-textarea v-model="editedEspolio.controloDescricao.notaCatalogador" label="Nota do catalogador"></v-textarea>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Anexo">
            <v-expansion-panel-text>
                <v-file-input label="Imagem" v-model="imagemFile" chips></v-file-input>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-form>
    </BaseDialog>

    <!-- Delete Confirmation Dialog -->
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
import { ref, onMounted } from 'vue';
import type { VForm } from 'vuetify/components';
import BaseDialog from '../../components/core/BaseDialog.vue';

// 1. Strict Typing
interface Espolio {
  _id: string | null;
  organizacao: {
    designacao: string;
    sigla: string;
    morada: string;
    contactos: string;
  };
  catalogacao: {
    identificacao: {
      designacaoAcervo: string;
      entidadeProdutora: string;
      nInventario: string;
      outraNumeracao: string;
      nivel: string;
      nucleo: string;
      categoria: string;
      tipologia: string;
      materiais: string[];
      titulo: string;
      dataPeca: string;
    };
    descricaoFisica: {
      medidas: {
        comprimento: number | null;
        largura: number | null;
        altura: number | null;
        diametroMaior: number | null;
        diametroMenor: number | null;
      };
      peso: number | null;
      tecnicas: string;
      descricaoTextual: string;
      marcasInscricoes: string;
    };
  };
  contexto: {
    lugares: string;
    uso: string;
    proveniencia: {
      coletor: {
        nome: string;
        profissao: string;
        morada: string;
      };
      informador: {
        nome: string;
        idade: number | null;
        profissao: string;
      };
    };
  };
  acesso: {
    estadoConservacao: string;
    intervencoes: string;
    localizacao: string;
    objetosAssociados: string;
  };
  controloDescricao: {
    bibliografia: string;
    dataRegisto: string;
    responsavel: string;
    notaCatalogador: string;
  };
  imagem: string;
}

const espolios = ref<Espolio[]>([]);
const editDialog = ref(false);
const deleteDialog = ref(false);
const dialogTitle = ref('');
const editedIndex = ref(-1);
const panel = ref<number[] | number>([0, 1]);
const form = ref<VForm | null>(null);
const isFormValid = ref(false);
const espolioToDelete = ref<Espolio | null>(null);

const rules = {
  required: (value: any) => !!value || 'Campo obrigatório',
};

const defaultEspolio: Espolio = {
  _id: null,
  organizacao: { designacao: '', sigla: '', morada: '', contactos: '' },
  catalogacao: {
    identificacao: { designacaoAcervo: '', entidadeProdutora: '', nInventario: '', outraNumeracao: '', nivel: 'peça', nucleo: '', categoria: '', tipologia: 'Objetos', materiais: [], titulo: '', dataPeca: '' },
    descricaoFisica: {
      medidas: { comprimento: null, largura: null, altura: null, diametroMaior: null, diametroMenor: null },
      peso: null, tecnicas: '', descricaoTextual: '', marcasInscricoes: ''
    },
  },
  contexto: {
    lugares: '', uso: '',
    proveniencia: {
      coletor: { nome: '', profissao: '', morada: '' },
      informador: { nome: '', idade: null, profissao: '' },
    },
  },
  acesso: { estadoConservacao: '', intervencoes: '', localizacao: '', objetosAssociados: '' },
  controloDescricao: { bibliografia: '', dataRegisto: new Date().toISOString().substr(0, 10), responsavel: '', notaCatalogador: '' },
  imagem: '',
};

const editedEspolio = ref<Espolio>(JSON.parse(JSON.stringify(defaultEspolio)));
const imagemFile = ref<File | File[] | null>(null);

const headers = ref([
  { title: 'Designação', key: 'organizacao.designacao' },
  { title: 'Nº Inventário', key: 'catalogacao.identificacao.nInventario' },
  { title: 'Título', key: 'catalogacao.identificacao.titulo' },
  { title: 'Ações', key: 'actions', sortable: false },
]);

onMounted(fetchEspolios);

async function fetchEspolios() {
  try {
    const data = await $fetch<Espolio[]>("/api/espolios");
    espolios.value = data;
  } catch (err) {
    console.error("Erro a buscar espólios:", err);
  }
}

function openAddDialog() {
  editedIndex.value = -1;
  editedEspolio.value = JSON.parse(JSON.stringify(defaultEspolio));
  dialogTitle.value = 'Adicionar Novo Espólio';
  editDialog.value = true;
}

function openEditDialog(item: Espolio) {
  editedIndex.value = espolios.value.findIndex(e => e._id === item._id);
  editedEspolio.value = JSON.parse(JSON.stringify(item));
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
    'catalogacao.descricaoFisica.medidas.diametroMaior',
    'catalogacao.descricaoFisica.medidas.diametroMenor',
    'catalogacao.descricaoFisica.peso',
    'contexto.proveniencia.informador.idade'
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

// 3. Improved Save Logic
async function saveEspolio() {
  // validate form (Vuetify validate may return boolean or Promise<boolean>)
  if (!form.value) return;
  const validateResult = form.value.validate ? form.value.validate() : false;
  const valid = await Promise.resolve(validateResult);
  if (!valid) return;

  const espolioToSave = sanitizeEspolioForSaving(editedEspolio.value);

  if (editedIndex.value > -1) {
    // Update
    try {
      if (!espolioToSave._id) {
        console.error('Espólio sem _id não pode ser atualizado');
      } else {
        const updatedEspolio = await $fetch<Espolio>(`/api/espolios/${encodeURIComponent(espolioToSave._id)}`, {
          method: 'PUT',
          body: espolioToSave,
        });
        if (updatedEspolio) {
          espolios.value[editedIndex.value] = updatedEspolio;
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar espólio:", error);
    }
  } else {
    // Create
    try {
      const newEspolio = await $fetch<Espolio>('/api/espolios', {
        method: 'POST',
        body: espolioToSave,
      });
      if (newEspolio) {
        espolios.value.push(newEspolio);
      }
    } catch (error) {
      console.error("Erro ao criar espólio:", error);
    }
  }
  editDialog.value = false;
}

// 4. Refined Delete Confirmation
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
    await $fetch<void>(`/api/espolios/${encodeURIComponent(espolioToDelete.value._id)}`, {
      method: 'DELETE',
    });
    espolios.value = espolios.value.filter(e => e._id !== espolioToDelete.value?._id);
  } catch (error) {
    console.error("Erro ao apagar espólio:", error);
  } finally {
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
</style>