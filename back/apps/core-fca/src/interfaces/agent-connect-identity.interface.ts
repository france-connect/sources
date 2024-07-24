/* istanbul ignore file */

// Declarative code

/**
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.5.1
 */
export interface IAgentIdentity {
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

export interface IAgentIdentityWithPublicness extends IAgentIdentity {
  is_service_public?: boolean;
}
