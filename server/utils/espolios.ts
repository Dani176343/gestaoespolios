import type { Espolio } from '~/types/espolio';

const espolios: Espolio[] = [
  {
    _id: '1',
    organizacao: {
      designacao: 'Museu Municipal',
      sigla: 'MM',
      morada: 'Rua do Museu, 123',
      contactos: '212345678',
    },
    catalogacao: {
      identificacao: {
        designacaoAcervo: 'Coleção de Cerâmica',
        entidadeProdutora: 'Oficina do Zé',
        nInventario: '12345',
        outraNumeracao: 'F-23',
        nivel: 'peça',
        nucleo: 'Núcleo A',
        categoria: 'Categoria A',
        tipologia: 'Objetos',
        materiais: ['Cerâmica'],
        titulo: 'Jarra',
        dataPeca: '1950',
      },
      descricaoFisica: {
        medidas: {
          comprimento: 10,
          largura: 10,
          altura: 20,
          diametroMaior: 12,
          diametroMenor: 8,
        },
        peso: 1.5,
        tecnicas: 'Torno de oleiro',
        descricaoTextual: 'Jarra de cerâmica pintada à mão.',
        marcasInscricoes: 'Assinatura \'Zé\' na base.',
      },
    },
    contexto: {
      lugares: 'Cozinha',
      uso: 'Decorativo',
      proveniencia: {
        coletor: {
          nome: 'João Silva',
          profissao: 'Professor',
          morada: 'Rua da Escola, 456',
        },
        informador: {
          nome: 'Maria Silva',
          idade: 80,
          profissao: 'Aposentada',
        },
      },
    },
    acesso: {
      estadoConservacao: 'Bom',
      intervencoes: 'Limpeza em 2010.',
      localizacao: 'Armazém 1, Prateleira 2',
      objetosAssociados: 'N/A',
    },
    controloDescricao: {
      bibliografia: 'N/A',
      dataRegisto: '2024-01-01',
      responsavel: 'Ana Costa',
      notaCatalogador: 'Peça em bom estado.',
    },
    imagem: '',
  }
];

export const getEspolios = () => espolios;

export const addEspolio = (espolio: Omit<Espolio, '_id'>): Espolio => {
  const newEspolio = { ...espolio, _id: String(espolios.length + 1) };
  espolios.push(newEspolio);
  return newEspolio;
};

export const updateEspolio = (id: string, updatedEspolio: Partial<Espolio>): Espolio | null => {
  const index = espolios.findIndex(e => e._id === id);
  if (index !== -1) {
    espolios[index] = { ...espolios[index], ...updatedEspolio };
    return espolios[index];
  }
  return null;
};

export const deleteEspolioById = (id: string | undefined): { success: boolean } | null => {
  const index = espolios.findIndex(e => e._id === id);
  if (index !== -1) {
    espolios.splice(index, 1);
    return { success: true };
  }
  return null;
};
