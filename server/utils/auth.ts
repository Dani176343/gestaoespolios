import { getRequestHeader, H3Event, createError } from 'h3';
import { jwtDecode } from 'jwt-decode';
import type { CustomJwtPayload } from '../../types/keycloak';

export function getOrganizationFromEvent(event: H3Event): string {
  const authHeader = getRequestHeader(event, 'authorization');

  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Missing authorization header' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    const orgsData = decodedToken.orgs;

    if (orgsData) {
      const orgKey = Object.keys(orgsData)[0];
      if (orgKey && orgsData[orgKey] && orgsData[orgKey].name) {
        return orgsData[orgKey].name[0];
      }
    }
  } catch (error) {
    // Log the error for debugging purposes on the server
    console.error('Authentication error:', error);
    throw createError({ statusCode: 401, statusMessage: 'Invalid authentication token' });
  }

  throw createError({ statusCode: 401, statusMessage: 'Organization data not found in token' });
}
