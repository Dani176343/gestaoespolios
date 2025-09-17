import { updateEspolio } from "../utils/espolios";
import { getOrganizationFromEvent } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const organization = getOrganizationFromEvent(event);
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' });
  }
  const body = await readBody(event);
  return updateEspolio(organization, id, body);
});
