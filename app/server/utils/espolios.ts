import type { Espolio } from '~/types/espolio';
import { getAcervoModel, connectToMongo } from '~/server/utils/db';

export const getEspolios = async (organization: string): Promise<Espolio[]> => {
  await connectToMongo();
  const AcervoModel = await getAcervoModel(organization);
  if (!AcervoModel) {
    return [];
  }
  const espolios = await AcervoModel.find({}).lean();
  console.log(`Found ${espolios.length} espolios in collection '${organization}'.`);
  return espolios as any;
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
    return saved.toObject() as any;
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
  delete updateData._id;
  const espolio = await AcervoModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
  return espolio as any;
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
  const result = await AcervoModel.findByIdAndDelete(id);
  if (result) {
    return { success: true };
  }
  return null;
};
