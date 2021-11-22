/* istanbul ignore file */

// Declarative code
export interface IAgentIdentity {
  sub: string;
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: string;
  // Agent Connect defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  usual_name: string;
  uid: string;
  email: string;
  siren?: string;
  siret?: string;
  // Agent Connect defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  organizational_unit?: string;
  // Agent Connect defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  belonging_population?: string;
  // Agent Connect defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  phone_number?: string;
  'chorusdt:societe'?: string;
  'chorusdt:matricule'?: string;
}
