import { deleteEspolioById } from "../utils/espolios";
import { getOrganizationFromEvent } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const organization = getOrganizationFromEvent(event);
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' });
  }
  return deleteEspolioById(organization, id);
});
