import { Injectable } from '@nestjs/common';

import { unique } from '@fc/common';

import { IClaim, IRichClaim, IScope } from '../interfaces';
import { ScopesIndexService } from './scopes-index.service';

@Injectable()
export class ScopesService {
  constructor(private readonly index: ScopesIndexService) {}

  getRawClaimsFromScopes(scopes: IScope[]): IClaim[] {
    const claims = scopes.reduce(
      (acc, scopeName) => acc.concat(this.index.scopes.get(scopeName)),
      [] as IClaim[],
    );

    /**
     * Same claim may be present in several scopes
     */
    const uniqueClaims = unique(claims);

    return uniqueClaims;
  }

  getRichClaimsFromScopes(scopes: IScope[]): IRichClaim[] {
    const claims = this.getRawClaimsFromScopes(scopes);

    const richClaims = claims.map((claimName) =>
      this.index.claims.get(claimName),
    );

    return richClaims;
  }
}
