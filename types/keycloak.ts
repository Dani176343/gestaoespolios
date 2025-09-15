import type { JwtPayload } from 'jwt-decode';

export interface UserInfo {
  sub: string;
  name?: string;
  fullName: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  preferred_username?: string;
  picture?: string;
  userPersonalAddress?: UserPersonalAddress;
}

export interface UserPersonalAddress {
  street: string;
  number: string;
  side: string;
  postalCode: string;
  locality: string;
  municipality: string;
  cellphone: string;
}

// Represents the entire decoded JWT payload
export interface CustomJwtPayload extends JwtPayload {
  orgs?: Orgs;
}

// Represents the 'orgs' claim, which contains dynamic keys for each organization
export interface Orgs {
  [key: string]: OrgData;
}

// Represents the data for a single organization within the 'orgs' claim
export interface OrgData {
  id: string;
  name: string[];
}
