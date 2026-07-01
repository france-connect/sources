import { EidasCountries } from '@fc/eidas-country';

import { EudiGenders } from '../enums';

/**
 * @see https://github.com/eu-digital-identity-wallet/eudi-doc-attestation-rulebooks-catalog/blob/main/rulebooks/pid/pid-rulebook.md
 */
export interface EudiPidInterface {
  family_name: string;
  given_name: string;
  birth_date: string;
  birth_place: string;
  nationality: EidasCountries[];

  age_birth_year?: number;
  age_in_years?: number;
  family_name_birth?: string;
  issuing_country?: EidasCountries;
  portrait?: object;
  age_over_18?: boolean;
  expiry_date?: Date;
  issuing_authority?: string;
  sex?: EudiGenders;
  trust_anchor?: string;
  birth_state?: string;
  birth_city?: string;
  resident_address?: string;
  resident_country?: EidasCountries;
  resident_state?: string;
  resident_city?: string;
  resident_postal_code?: string;
  resident_street?: string;
  resident_house_number?: string;
  personal_administrative_number?: string;
  given_name_birth?: string;
  email_address?: string;
  mobile_phone_number?: string;
  issuance_date?: string;
  document_number?: string;
  issuing_jurisdiction?: EidasCountries;
  location_status?: string;
  portrait_capture_date?: string;
}
