import { addEspolio } from "../utils/espolios";
import { getOrganizationFromEvent } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const organization = getOrganizationFromEvent(event);
  const body = await readBody(event);
  return addEspolio(organization, body);
});
