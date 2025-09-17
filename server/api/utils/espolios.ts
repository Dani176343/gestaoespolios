import type { Espolio } from '~~/types/espolio';

const API_URL = 'http://localhost:3000/espolios';

export const getEspolios = async (organization: string): Promise<Espolio[]> => {
  try {
    // The user only specified this endpoint, so I'll assume it's a GET request
    const espolios = await $fetch<Espolio[]>(`${API_URL}/${organization}`);
    console.log(`Found ${espolios.length} espolios for organization '${organization}'.`);
    return espolios;
  } catch (error) {
    console.error(`Error fetching espolios for organization ${organization}:`, error);
    return [];
  }
};

export const addEspolio = async (organization: string, espolio: Omit<Espolio, '_id'>): Promise<Espolio | null> => {
  try {
    const newEspolio = await $fetch<Espolio>(`${API_URL}/${organization}`, {
      method: 'POST',
      body: espolio,
    });
    console.log(`Successfully added new espolio for organization: ${organization}`);
    return newEspolio;
  } catch (error) {
    console.error(`Error adding espolio for organization ${organization}:`, error);
    return null;
  }
};

export const updateEspolio = async (organization: string, id: string, updatedEspolio: Partial<Espolio>): Promise<Espolio | null> => {
  try {
    const espolio = await $fetch<Espolio>(`${API_URL}/${organization}/${id}`, {
      method: 'PUT',
      body: updatedEspolio,
    });
    return espolio;
  } catch (error) {
    console.error(`Error updating espolio ${id} for organization ${organization}:`, error);
    return null;
  }
};

export const deleteEspolioById = async (organization: string, id: string | undefined): Promise<{ success: boolean } | null> => {
  if (!id) {
    return null;
  }
  try {
    await $fetch(`${API_URL}/${organization}/${id}`, {
      method: 'DELETE',
    });
    return { success: true };
  } catch (error) {
    console.error(`Error deleting espolio ${id} for organization ${organization}:`, error);
    return null;
  }
};
