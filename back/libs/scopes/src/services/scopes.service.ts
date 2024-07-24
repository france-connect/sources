import { Injectable } from '@nestjs/common';

import { unique } from '@fc/common';

import * as PROVIDERS from '../data';
import {
  ClaimInterface,
  RichClaimInterface,
  ScopeInterface,
} from '../interfaces';
import { ScopesIndexService } from './scopes-index.service';

@Injectable()
export class ScopesService {
  constructor(private readonly index: ScopesIndexService) {}

  getRawClaimsFromScopes(scopes: ScopeInterface[]): ClaimInterface[] {
    const claims = scopes.reduce(
      (acc, scopeName) => acc.concat(this.index.getScope(scopeName)),
      [] as ClaimInterface[],
    );

    // Some claims may be duplicated between several scopes
    const uniqueClaims = unique(claims.filter(Boolean));

    return uniqueClaims;
  }

  getRichClaimsFromClaims(claims: ClaimInterface[]): RichClaimInterface[] {
    const richClaims = claims
      .map((claimName) => this.index.getClaim(claimName))
      .filter(Boolean);

    return richClaims;
  }

  getRichClaimsFromScopes(scopes: ScopeInterface[]): RichClaimInterface[] {
    const claims = this.getRawClaimsFromScopes(scopes);
    const richClaims = this.getRichClaimsFromClaims(claims);

    return richClaims;
  }

  getScopesByProviderSlug(providerSlug: string): ScopeInterface[] {
    const provider = Object.values(PROVIDERS).find(
      ({ provider }) => provider.slug === providerSlug,
    );
    return Object.keys(provider.scopes);
  }
}
