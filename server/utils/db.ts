import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/gestao_espolios";

let isConnected = false;

export async function connectToMongo() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

const AcervoSchema = new mongoose.Schema({
  organizacao: Object,
  catalogacao: Object
});

export const AcervoModel = mongoose.models.Acervo || mongoose.model("Acervo", AcervoSchema);
