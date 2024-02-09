import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { IRichClaim } from '@fc/scopes';
import { Providers } from '@fc/scopes/enum';
import { TemplateMethod } from '@fc/view-templates';

import { AppConfig } from '../dto';

@Injectable()
export class ScopesHelper {
  constructor(private readonly config: ConfigService) {}

  @TemplateMethod('claimOrder')
  claimOrder(a: IRichClaim, b: IRichClaim): number {
    /**
     * We only need to check on one of the claims
     * because claims are grouped by provider,
     * thus if one claim is identity, all claims are identity
     */
    if (this.isIdentityClaim(a)) {
      return (
        this.getIdentityClaimPosition(a) - this.getIdentityClaimPosition(b)
      );
    }

    /**
     * Standard alphabetical sort for other claims
     */
    return a.label < b.label ? -1 : 1;
  }

  private getIdentityClaimPosition(claim: IRichClaim): number {
    const { sortedClaims } = this.config.get<AppConfig>('App');

    const position = sortedClaims.indexOf(claim.identifier);
    /**
     * Hard coded sort for identity claims
     * If a claim is not in the sortedClaims array, it will be sorted to the end
     */
    if (position === -1) {
      return Infinity;
    }

    return position;
  }

  @TemplateMethod('groupByDataProvider')
  groupByDataProvider(claims: IRichClaim[]): Record<string, IRichClaim[]>[] {
    const groups = {};
    claims.filter(this.hasLabel).forEach(this.regroup.bind(this, groups));

    return Object.values<Record<string, IRichClaim[]>>(groups).sort(
      this.dataProviderOrder.bind(this),
    );
  }

  private hasLabel(claim: IRichClaim): boolean {
    return Boolean(claim.label);
  }

  private isIdentityClaim(claim: IRichClaim): boolean {
    const identityProviders: Providers[] = [
      Providers.FCP_HIGH,
      Providers.FCP_LOW,
    ];

    const result = identityProviders.includes(claim.provider.key as Providers);

    return result;
  }

  private dataProviderOrder(a: IRichClaim[], b: IRichClaim[]): number {
    // FC Must Come First
    if (this.isIdentityClaim(a[0])) {
      return -1;
    }

    if (this.isIdentityClaim(b[0])) {
      return 1;
    }

    // Normal sort
    return a[0].provider.label < b[0].provider.label ? -1 : 1;
  }

  private regroup(
    groups: Record<string, IRichClaim[]>,
    claim: IRichClaim,
  ): void {
    if (!groups[claim.provider.key]) {
      groups[claim.provider.key] = [];
    }

    groups[claim.provider.key].push(claim);
  }
}
