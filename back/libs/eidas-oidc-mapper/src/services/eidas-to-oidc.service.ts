import { Injectable } from '@nestjs/common';

import {
  EidasAttributes,
  EidasRequest,
  EidasResponse,
  EidasResponseAttributes,
} from '@fc/eidas';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity, OidcError } from '@fc/oidc';

import {
  AttributesToClaimsMap,
  LevelOfAssurancesToAcrValueMap,
  RequestedAttributesToScopesMap,
} from '../mappers';

@Injectable()
export class EidasToOidcService {
  constructor(private readonly logger: LoggerService) {
    logger.setContext(this.constructor.name);
  }
  /**
   * Takes eIDAS requested attributes and level of assurance to return oidc
   * scope and acr_values
   *
   * @param requestedAttributes The eIDAS requested attributes
   * @param levelOfAssurance The eIDAS level requested for authentication
   * @return The oidc scope and acr_values
   */
  mapPartialRequest({
    levelOfAssurance,
    requestedAttributes,
  }: Partial<EidasRequest>) {
    const scopeSet = this.mapRequestedAttributesToScopes(requestedAttributes);
    const scope = Array.from(scopeSet);

    this.logger.trace({ requestedAttributes, scope });
    return {
      // oidc claim
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: LevelOfAssurancesToAcrValueMap[levelOfAssurance],
      scope,
    };
  }

  mapPartialResponseSuccess({ attributes, levelOfAssurance }: EidasResponse) {
    return {
      // oidc claim
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr: LevelOfAssurancesToAcrValueMap[levelOfAssurance],
      userinfos: this.mapAttributesToClaims(attributes),
    };
  }

  mapPartialResponseFailure({ status }: EidasResponse): OidcError {
    const errorDescription = `StatusCode: ${status.statusCode}\nSubStatusCode: ${status.subStatusCode}\nStatusMessage: ${status.statusMessage}`;

    return {
      error: 'eidas_node_error',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      error_description: errorDescription,
    };
  }

  /**
   * Takes eIDAS requested attributes to return oidc scope
   *
   * @param requestedAttributes The eIDAS requested attributes
   * @return a set of unique oidc scopes
   */
  private mapRequestedAttributesToScopes(
    requestedAttributes: EidasAttributes[],
  ): Set<string> {
    const scopesSet = new Set<string>();

    /**
     * Scope "openid" is always mandatory.
     * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.1
     */
    scopesSet.add('openid');

    return requestedAttributes.reduce(
      this.requestedAttributesToScopesReducer,
      scopesSet,
    );
  }

  /**
   * For each eIDAS requested attribute, add the corresponding scopes to a set
   *
   * @param scopeSet The scopes set containing the uniques oidc scopes
   * @param attribute the current eIDAS attribute
   * @return The scope set
   */
  private requestedAttributesToScopesReducer(
    scopeSet: Set<string>,
    attribute: EidasAttributes,
  ): Set<string> {
    RequestedAttributesToScopesMap[attribute]?.forEach((elem) => {
      scopeSet.add(elem);
    });
    return scopeSet;
  }

  private mapAttributesToClaims(
    attributes: Partial<EidasResponseAttributes>,
  ): IOidcIdentity {
    const attributesKeys = Object.keys(attributes);

    return attributesKeys.reduce(
      this.getClaimsBoundedAttributesToClaimsReducer(attributes),
      {} as IOidcIdentity,
    );
  }

  /**
   * Bind the attributes to the attributesToClaimsReducer
   *
   * @param attributes The eIDAS attributes from the eIDAS node
   * @param claims The oidc claims accumulator
   * @param currentAttribute The current eIDAS attribute
   * @return The attributesToClaimsReducer with bounded eIDAS attributes
   */
  private getClaimsBoundedAttributesToClaimsReducer(
    attributes: Partial<EidasResponseAttributes>,
  ) {
    return this.attributesToClaimsReducer.bind(EidasToOidcService, attributes);
  }

  private attributesToClaimsReducer(
    attributes: Partial<EidasResponseAttributes>,
    claims,
    currentAttribute,
  ): IOidcIdentity {
    if (AttributesToClaimsMap[currentAttribute]) {
      Object.assign(
        claims,
        AttributesToClaimsMap[currentAttribute](attributes),
      );
    }

    return claims;
  }
}
