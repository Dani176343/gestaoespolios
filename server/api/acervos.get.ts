import { AcervoModel, connectToMongo } from "~/server/utils/db"

export default defineEventHandler(async () => {
  try {
    await connectToMongo()
    const acervos = await AcervoModel.find()
    return acervos
  } catch (err) {
    console.error(err)
    return { error: "Erro a ligar ao Mongo" }
  }
})
