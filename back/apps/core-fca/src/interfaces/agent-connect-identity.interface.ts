/* istanbul ignore file */

// Declarative code

/**
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.5.1
 */
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

export interface IAgentIdentityWithPublicness extends IAgentIdentity {
  // external defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  is_service_public?: boolean;
}
