import { addEspolio } from "../../../server/utils/espolios";
import { getOrganizationFromEvent } from "../../../server/utils/auth";

export default defineEventHandler(async (event) => {
  const organization = getOrganizationFromEvent(event);
  const body = await readBody(event);
  return addEspolio(organization, body);
});
