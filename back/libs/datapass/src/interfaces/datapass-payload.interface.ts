import { DatapassEidasLevels, DatapassEvents } from '../enums';

export interface Organization {
  id: number;
  name: string;
  siret: string;
}

export interface Applicant {
  id?: number;
  email: string;
  given_name: string;
  family_name: string;
  phone_number?: string;
}

export interface TechnicalContact {
  contact_technique_given_name: string;
  contact_technique_family_name: string;
  contact_technique_phone_number: string;
  contact_technique_email: string;
}

export interface DatapassData extends TechnicalContact {
  intitule: string;
  scopes: string[];
  france_connect_eidas: DatapassEidasLevels;
}

export interface Authorization {
  id: string;
  state: string;
  authorization_request_class: string;
  revoked: boolean;
}

export interface DatapassPayloadData {
  id: number;
  public_id: string;
  state: string;
  form_uid: string;
  organization: Organization;
  applicant: Applicant;
  data: DatapassData;
  authorizations: Authorization[];
}

export interface DatapassPayloadInterface {
  event: DatapassEvents;
  fired_at: number;
  model_type: string;
  last_validated_at?: string | null;
  data: DatapassPayloadData;
}
