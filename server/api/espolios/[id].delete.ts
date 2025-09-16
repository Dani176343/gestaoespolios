import { deleteEspolioById } from "../../../server/utils/espolios";
import { getOrganizationFromEvent } from "../../../server/utils/auth";

export default defineEventHandler(async (event) => {
  const organization = getOrganizationFromEvent(event);
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' });
  }
  return deleteEspolioById(organization, id);
});
