import { getEspolios } from "~/server/utils/espolios";
import { getOrganizationFromEvent } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const organization = getOrganizationFromEvent(event);
  console.log(`Fetching data from collection: ${organization}`);
  return getEspolios(organization);
});
