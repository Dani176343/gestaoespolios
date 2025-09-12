export interface Espolio {
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
      numeroInventario: string;
      outraNumeracao: string[];
      nivel: string;
      nucleo: string[];
      categoria: string[];
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
        diametro: {
          maior: number | null;
          menor: number | null;
        };
      };
      peso: number | null;
      tecnicas: string[];
      descricaoTextual: string;
      marcasOuInscricoes: string;
    };
    contexto: {
      lugares: string[];
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
      intervencoes: string[];
      localizacao: string;
      objetosAssociados: string[];
    };
    controloDescricao: {
      bibliografia: string[];
      dataRegisto: string;
      responsavel: string;
      notaCatalogador: string;
    };
    anexo: {
      imagem: string;
    };
  };
}