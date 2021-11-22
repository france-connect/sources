import { Injectable } from '@nestjs/common';

import { difference, intersection, union, unique } from '@fc/common';

const MAPPING_ALIAS_SCOPES = {
  openid: ['sub'],
  profile: [
    'given_name',
    'family_name',
    'birthdate',
    'gender',
    'preferred_username',
  ],
  phone: ['phone_number'],
  birth: ['birthplace', 'birthcountry'],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  identite_pivot: [
    'given_name',
    'family_name',
    'birthdate',
    'gender',
    'birthplace',
    'birthcountry',
  ],
};

/**
 * @TODO #452 Mettre les scopes label en base de donnée
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/452
 */
const STANDARD_IDENTITY_SCOPES_LABEL = {
  openid: 'sub',
  gender: `Sexe`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: `Prénom(s)`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  family_name: `Nom de naissance`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preferred_username: `Nom d'usage`,
  birthdate: `Date de naissance`,
  birthplace: `Lieu de naissance`,
  birthcountry: `Pays de naissance`,
  address: `Adresse postale`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  phone_number: `Téléphone`,
  email: `Adresse email`,
};

@Injectable()
export class ScopesService {
  /**
   * remove openid from the list of scopes
   * @param {Array<string>} scopes list of scopes to filter
   */
  private removeOpenId(scopes: string[]): string[] {
    return scopes.filter((scope) => scope !== 'openid');
  }

  private seperate(array1: string[], array2: string[]): [string[], string[]] {
    return [difference(array1, array2), intersection(array1, array2)];
  }

  /**
   * extract the unit scopes from a grouped scope (Profile -> gender,family_name...)
   * @param {*} scopes
   */
  getClaimsFromScopes(scopes): string[] {
    return unique(
      scopes.flatMap((alias) => MAPPING_ALIAS_SCOPES[alias] || alias),
    );
  }

  /**
   * Utils to separate alias from group of scopes and get the final scopes
   * @param {Array} scopes
   */
  private extractAllScopes(scopes: string[]): {
    identity: string[];
    alias: string[];
  } {
    // extract alias scopes
    const [identityScopes, aliasScopes] = this.seperate(
      scopes,
      Object.keys(MAPPING_ALIAS_SCOPES),
    );

    // replace all alias scopes with their mapped scopes
    const ungroupedScopes = this.getClaimsFromScopes(aliasScopes);

    return { identity: identityScopes, alias: ungroupedScopes };
  }

  /**
   * Utils to transform grouped scope in unit scopes and get the unique scopes
   * @param {Array} scopes
   * @param {boolean} removeIgnored allow to remove ignored scopes based on scopes analysis
   */
  private flattenAllScopes(scopes: string[]): string[] {
    // extract alias scopes
    const { identity, alias } = this.extractAllScopes(scopes);

    // and then merge all the client scopes
    return unique(union(identity, alias));
  }

  /**
   * transform scopes name to a human readable name
   * @param {Array<string>=[]} scopesParam list of scopes to transform
   */
  async mapScopesToLabel(scopesParam: string[] = []): Promise<string[]> {
    if (!Array.isArray(scopesParam)) {
      throw new Error(`Scopes must be Array and not ${typeof scopesParam}`);
    }
    const scopesIdentity = this.removeOpenId(scopesParam);
    const scopes = this.flattenAllScopes(scopesIdentity);
    // safety to replace identity scopes by human readable label
    return scopes.map((scope) =>
      scope in STANDARD_IDENTITY_SCOPES_LABEL
        ? STANDARD_IDENTITY_SCOPES_LABEL[scope]
        : scope,
    );
  }
}
