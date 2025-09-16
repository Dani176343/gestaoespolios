import type { Espolio } from '../../types/espolio';
import { getAcervoModel, connectToMongo } from '../../server/utils/db';

export const getEspolios = async (organization: string): Promise<Espolio[]> => {
  await connectToMongo();
  const AcervoModel = await getAcervoModel(organization);
  if (!AcervoModel) {
    return [];
  }
  const espolios = await AcervoModel.find({}).lean<Espolio[]>();
  console.log(`Found ${espolios.length} espolios in collection '${organization}'.`);
  return espolios;
};

export const addEspolio = async (organization: string, espolio: Omit<Espolio, '_id'>): Promise<Espolio | null> => {
  await connectToMongo();
  const AcervoModel = await getAcervoModel(organization);
  if (!AcervoModel) {
    console.error(`AcervoModel not found for organization: ${organization}`);
    return null;
  }
  try {
    const newEspolio = new AcervoModel(espolio);
    const saved = await newEspolio.save();
    console.log(`Successfully added new espolio to collection: ${organization}`);
    return saved.toObject();
  } catch (error) {
    console.error(`Error adding espolio to collection ${organization}:`, error);
    return null;
  }
};

export const updateEspolio = async (organization: string, id: string, updatedEspolio: Partial<Espolio>): Promise<Espolio | null> => {
  await connectToMongo();
  const AcervoModel = await getAcervoModel(organization);
  if (!AcervoModel) {
    return null;
  }
  const updateData = { ...updatedEspolio };
  delete (updateData as Partial<Espolio>)._id;
  const espolio = await AcervoModel.findByIdAndUpdate(id, updateData, { new: true }).lean<Espolio>();
  return espolio;
};

export const deleteEspolioById = async (organization: string, id: string | undefined): Promise<{ success: boolean } | null> => {
  if (!id) {
    return null;
  }
  await connectToMongo();
  const AcervoModel = await getAcervoModel(organization);
  if (!AcervoModel) {
    return null;
  }
  const result = await AcervoModel.findByIdAndDelete(id).lean<Espolio>();
  if (result) {
    return { success: true };
  }
  return null;
};
