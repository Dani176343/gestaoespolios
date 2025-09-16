import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/gestao_espolios";

let isConnected = false;

export async function connectToMongo() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

const AcervoSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Assuming _id is ObjectId
  organizacao: mongoose.Schema.Types.Mixed,
  catalogacao: mongoose.Schema.Types.Mixed,
}, { strict: false });

export const getAcervoModel = async (collectionName: string) => {
  // Check if the model has already been compiled
  if (mongoose.models[collectionName]) {
    console.log(`Model for collection '${collectionName}' already compiled.`);
    return mongoose.models[collectionName];
  }

  // Check if the collection actually exists in the database
  await connectToMongo(); // Ensure connection is established before accessing mongoose.connection.db
  const collections = await mongoose.connection.db?.listCollections().toArray();
  const collectionExists = collections?.some(col => col.name === collectionName) ?? false;
  console.log(`Checking for collection '${collectionName}'. Exists: ${collectionExists}`);
  if (collectionExists) {
    // If it exists, compile and return the model
    return mongoose.model(collectionName, AcervoSchema, collectionName);
  } else {
    // If it does not exist, do NOT create it, return null
    console.log(`Collection '${collectionName}' does not exist. Returning null.`);
    return null;
  }
};
