import mongoose from "mongoose"

const MONGO_URI = "mongodb://localhost:27017/gestao_espolios"

let isConnected = false
async function connectToMongo() {
  if (isConnected) return
  await mongoose.connect(MONGO_URI)
  isConnected = true
}

const AcervoSchema = new mongoose.Schema({
  organizacao: Object,
  catalogacao: Object
})

const Acervo = mongoose.models.Acervo || mongoose.model("Acervo", AcervoSchema)

export default defineEventHandler(async () => {
  try {
    await connectToMongo()
    const acervos = await Acervo.find()
    return acervos
  } catch (err) {
    console.error(err)
    return { error: "Erro a ligar ao Mongo" }
  }
})
