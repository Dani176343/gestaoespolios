import type { Espolio } from '~~/types/espolio';
import type { H3Event } from 'h3';

const API_URL = 'http://localhost:3000/espolios';

/**
 * Recursively appends properties of a JavaScript object to a FormData object.
 * Nested objects are flattened with dot notation (e.g., { a: { b: 'c' } } becomes 'a.b': 'c').
 * Arrays are appended with multiple entries under the same key.
 * @param formData The FormData object to append to.
 * @param data The JavaScript object or value to append.
 * @param parentKey The base key for nested properties.
 */
function appendToFormData(formData: FormData, data: any, parentKey?: string) {
    if (data === null || data === undefined) {
        return;
    }

    if (Array.isArray(data)) {
        // Append each item in the array with the same key. FormData handles this by creating a list of values.
        data.forEach(item => {
            appendToFormData(formData, item, parentKey);
        });
    } else if (typeof data === 'object' && !(data instanceof File) && !(data instanceof Date)) {
        // For objects, recurse through keys.
        Object.keys(data).forEach(key => {
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            appendToFormData(formData, data[key], newKey);
        });
    } else if (parentKey) {
        // For primitive values, append them directly.
        formData.append(parentKey, data.toString());
    }
}

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
    const imagePart = multipart.find(p => p.name === 'imagem');

    if (!espolioPart || !espolioPart.data) {
      throw new Error("Missing 'espolio' part in multipart data");
    }

    const espolioData = JSON.parse(espolioPart.data.toString());
    const formData = new FormData();

    // Flatten the JSON data and append its fields to FormData
    appendToFormData(formData, espolioData);

    // Append the image file if it exists
    if (imagePart && imagePart.data) {
        const blob = new Blob([imagePart.data as BlobPart], { type: imagePart.type });
        formData.append('imagem', blob, imagePart.filename);
    }

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
    const imagePart = multipart.find(p => p.name === 'imagem');

    if (!espolioPart || !espolioPart.data) {
        throw new Error("Missing 'espolio' part in multipart data");
    }

    const espolioData = JSON.parse(espolioPart.data.toString());
    const formData = new FormData();

    // Flatten the JSON data and append its fields to FormData
    appendToFormData(formData, espolioData);

    // Append the image file if it exists
    if (imagePart && imagePart.data) {
        const blob = new Blob([imagePart.data as BlobPart], { type: imagePart.type });
        formData.append('imagem', blob, imagePart.filename);
    }

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
