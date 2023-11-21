import { Injectable } from '@nestjs/common';

import { unique } from '@fc/common';

import * as Data from '../data';
import { IClaim, IRichClaim, IScope } from '../interfaces';
import { ScopesIndexService } from './scopes-index.service';

@Injectable()
export class ScopesService {
  constructor(private readonly index: ScopesIndexService) {}

  getRawClaimsFromScopes(scopes: IScope[]): IClaim[] {
    const claims = scopes.reduce(
      (acc, scopeName) => acc.concat(this.index.getScope(scopeName)),
      [] as IClaim[],
    );

    /**
     * Same claim may be present in several scopes
     */
    const uniqueClaims = unique(claims.filter(Boolean));

    return uniqueClaims;
  }

  getRichClaimsFromClaims(claims: IClaim[]): IRichClaim[] {
    const richClaims = claims
      .map((claimName) => this.index.getClaim(claimName))
      .filter(Boolean);

    return richClaims;
  }

  getRichClaimsFromScopes(scopes: IScope[]): IRichClaim[] {
    const claims = this.getRawClaimsFromScopes(scopes);
    const richClaims = this.getRichClaimsFromClaims(claims);

    return richClaims;
  }

  getScopesByDataProvider(dataProvider: string): IScope[] {
    const provider = Object.values(Data).find(
      ({ provider }) => provider.key === dataProvider,
    );
    const scopes = Object.keys(provider.scopes);

    return scopes;
  }
}
