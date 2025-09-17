import { addEspolio } from "../utils/espolios";
import { getOrganizationFromEvent } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const organization = getOrganizationFromEvent(event);
  return addEspolio(organization, event);
});
