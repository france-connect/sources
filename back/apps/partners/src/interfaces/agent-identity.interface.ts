/* istanbul ignore file */

// Declarative code
export interface AgentIdentityInterface {
  sub: string;
  given_name: string;
  usual_name: string;
  uid: string;
  email: string;
  siren?: string;
  siret?: string;
  organizational_unit?: string;
  belonging_population?: string;
  phone_number?: string;
  'chorusdt:societe'?: string;
  'chorusdt:matricule'?: string;
}
