import { Injectable } from '@nestjs/common';

import { unique } from '@fc/common';
import { PartnersPlatformEnum } from '@fc/partners-service-provider/enums';

import { PlatformProviderMap } from '../constants';
import * as PROVIDERS from '../data';
import {
  ClaimInterface,
  DatapassScopeMappingInterface,
  ProviderMappingsInterface,
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
    const { scopes } = this.getProviderMappings(providerSlug);

    return Object.keys(scopes);
  }

  getScopesFromDatapassScopes(
    platformName: PartnersPlatformEnum,
    datapassScopes: ScopeInterface[],
  ): ScopeInterface[] {
    const providerSlug = PlatformProviderMap[platformName];

    const mapping = this.getDatapassScopesMapping(providerSlug);

    const providerScopes = datapassScopes.flatMap(
      (scope) => mapping[scope] || [scope],
    );

    const claims = this.getRawClaimsFromScopes(unique(providerScopes));

    return this.getScopesFromClaims(claims);
  }

  getScopesFromClaims(claims: ClaimInterface[]): string[] {
    const includesClaim = (claim: ClaimInterface) => claims.includes(claim);

    const scopes = this.index.getScopes();

    return Array.from(scopes.entries())
      .filter(([, scopeClaims]) => scopeClaims.every(includesClaim))
      .map(([scope]) => scope);
  }

  private getProviderMappings(providerSlug: string): ProviderMappingsInterface {
    return Object.values(PROVIDERS).find(
      ({ provider }) => provider.slug === providerSlug,
    );
  }

  private getDatapassScopesMapping(
    providerSlug: string,
  ): DatapassScopeMappingInterface {
    const { datapassScopeMapping } = this.getProviderMappings(providerSlug);

    return datapassScopeMapping || {};
  }
}
