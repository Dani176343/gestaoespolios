import mongoose, { Model } from "mongoose";
import type { Espolio } from "../../types/espolio";

const MONGO_URI = "mongodb://localhost:27017/gestao_espolios";

let isConnected = false;

export async function connectToMongo() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

const AcervoSchema = new mongoose.Schema<Espolio>({
  organizacao: {
    designacao: String,
    sigla: String,
    morada: String,
    contactos: String,
  },
  catalogacao: {
    identificacao: {
      designacaoAcervo: String,
      entidadeProdutora: String,
      numeroInventario: String,
      outraNumeracao: [String],
      nivel: String,
      nucleo: [String],
      categoria: [String],
      tipologia: String,
      materiais: [String],
      titulo: String,
      dataPeca: String,
    },
    descricaoFisica: {
      medidas: {
        comprimento: Number,
        largura: Number,
        altura: Number,
        diametro: {
          maior: Number,
          menor: Number,
        },
      },
      peso: Number,
      tecnicas: [String],
      descricaoTextual: String,
      marcasOuInscricoes: String,
    },
    contexto: {
      lugares: [String],
      uso: String,
      proveniencia: {
        coletor: {
          nome: String,
          profissao: String,
          morada: String,
        },
        informador: {
          nome: String,
          idade: Number,
          profissao: String,
        },
      },
    },
    acesso: {
      estadoConservacao: String,
      intervencoes: [String],
      localizacao: String,
      objetosAssociados: [String],
    },
    controloDescricao: {
      bibliografia: [String],
      dataRegisto: String,
      responsavel: String,
      notaCatalogador: String,
    },
    anexo: {
      imagem: String,
    },
  },
}, { strict: false });

type EspolioModel = Model<Espolio>;

export const getAcervoModel = async (collectionName: string): Promise<EspolioModel | null> => {
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName] as EspolioModel;
  }

  await connectToMongo();
  const collections = await mongoose.connection.db?.listCollections().toArray();
  const collectionExists = collections?.some(col => col.name === collectionName) ?? false;

  if (collectionExists) {
    return mongoose.model<Espolio>(collectionName, AcervoSchema, collectionName);
  } else {
    return null;
  }
};
