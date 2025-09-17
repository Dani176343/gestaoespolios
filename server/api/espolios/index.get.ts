import { getEspolios } from "../utils/espolios";
import { getOrganizationFromEvent } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const organization = getOrganizationFromEvent(event);
  console.log(`Fetching data from collection: ${organization}`);
  return getEspolios(organization);
});
