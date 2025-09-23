import type { Espolio } from '~~/types/espolio';
import type { H3Event } from 'h3';

const API_URL = 'http://localhost:3000/espolios';

export const getEspolios = async (organization: string): Promise<Espolio[]> => {
  try {
    const espolios = await $fetch<Espolio[]>(`${API_URL}/${organization}`);
    console.log(`Found ${espolios.length} espolios for organization '${organization}'.`);
    return espolios;
  } catch (error) {
    console.error(`Error fetching espolios for organization ${organization}:`, error);
    return [];
  }
};

export const addEspolio = async (organization: string, event: H3Event): Promise<Espolio | null> => {
  try {
    const multipart = await readMultipartFormData(event);
    if (!multipart) {
      // Fallback for non-multipart requests
      const body = await readBody(event);
      return await $fetch<Espolio>(`${API_URL}/${organization}`, { method: 'POST', body });
    }

    const espolioPart = multipart.find(p => p.name === 'espolio');
    if (!espolioPart || !espolioPart.data) {
      throw new Error("Missing 'espolio' part in multipart data");
    }

    const formData = new FormData();
    formData.append('espolio', espolioPart.data.toString());

    const imageParts = multipart.filter(p => p.name?.startsWith('imagem_'));
    imageParts.forEach(imagePart => {
      if (imagePart.data) {
        const blob = new Blob([imagePart.data as BlobPart], { type: imagePart.type });
        formData.append(imagePart.name!, blob, imagePart.filename);
      }
    });

    const newEspolio = await $fetch<Espolio>(`${API_URL}/${organization}`, {
      method: 'POST',
      body: formData,
    });

    console.log(`Successfully added new espolio for organization: ${organization}`);
    return newEspolio;
  } catch (error) {
    console.error(`Error adding espolio for organization ${organization}:`, error);
    return null;
  }
};

export const updateEspolio = async (organization: string, id: string, event: H3Event): Promise<Espolio | null> => {
  try {
    const multipart = await readMultipartFormData(event);
    if (!multipart) {
        // Fallback for non-multipart requests
        const body = await readBody(event);
        return await $fetch<Espolio>(`${API_URL}/${organization}/${id}`, { method: 'PUT', body });
    }

    const espolioPart = multipart.find(p => p.name === 'espolio');
    if (!espolioPart || !espolioPart.data) {
        throw new Error("Missing 'espolio' part in multipart data");
    }

    const formData = new FormData();
    formData.append('espolio', espolioPart.data.toString());

    const imageParts = multipart.filter(p => p.name?.startsWith('imagem_'));
    imageParts.forEach(imagePart => {
      if (imagePart.data) {
        const blob = new Blob([imagePart.data as BlobPart], { type: imagePart.type });
        formData.append(imagePart.name!, blob, imagePart.filename);
      }
    });

    const espolio = await $fetch<Espolio>(`${API_URL}/${organization}/${id}`, {
      method: 'PUT',
      body: formData,
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