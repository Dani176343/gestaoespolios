import type { Espolio } from '~/types/espolio';
import { AcervoModel, connectToMongo } from '~/server/utils/db';

export const getEspolios = async (): Promise<Espolio[]> => {
  await connectToMongo();
  // Using .lean() to get plain JS objects, which is faster.
  // Nitro will automatically convert ObjectId to string during JSON serialization.
  const espolios = await AcervoModel.find({}).lean();
  // Although Nitro handles serialization, we cast to `any` to satisfy TypeScript
  // since Mongoose's .lean() returns _id as an ObjectId, not a string.
  return espolios as any;
};

export const addEspolio = async (espolio: Omit<Espolio, '_id'>): Promise<Espolio> => {
  await connectToMongo();
  const newEspolio = new AcervoModel(espolio);
  const saved = await newEspolio.save();
  // `toObject()` returns a plain object. We cast to `any` for the same `_id` type reason.
  return saved.toObject() as any;
};

export const updateEspolio = async (id: string, updatedEspolio: Partial<Espolio>): Promise<Espolio | null> => {
  await connectToMongo();
  // The frontend sends the whole object, including `_id`. We should remove it from the update payload.
  const updateData = { ...updatedEspolio };
  delete updateData._id;
  const espolio = await AcervoModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
  return espolio as any;
};

export const deleteEspolioById = async (id: string | undefined): Promise<{ success: boolean } | null> => {
  if (!id) {
    return null;
  }
  await connectToMongo();
  const result = await AcervoModel.findByIdAndDelete(id);
  if (result) {
    return { success: true };
  }
  return null;
};
