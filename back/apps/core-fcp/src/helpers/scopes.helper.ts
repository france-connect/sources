import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { I18nService } from '@fc/i18n';
import { RichClaimInterface } from '@fc/scopes';
import { Providers } from '@fc/scopes/enum';
import { TemplateMethod } from '@fc/view-templates';

import { AppConfig } from '../dto';

@Injectable()
export class ScopesHelper {
  constructor(
    private readonly config: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  @TemplateMethod('claimOrder')
  claimOrder(a: RichClaimInterface, b: RichClaimInterface): number {
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

  private getIdentityClaimPosition(claim: RichClaimInterface): number {
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
  groupByDataProvider(
    claims: RichClaimInterface[],
  ): Record<string, RichClaimInterface[]>[] {
    const groups = {};
    claims
      .map(this.addLabel.bind(this))
      .filter(this.hasLabel)
      .forEach(this.regroup.bind(this, groups));

    return Object.values<Record<string, RichClaimInterface[]>>(groups).sort(
      this.dataProviderOrder.bind(this),
    );
  }

  addLabel(claim: RichClaimInterface) {
    const label = this.i18n.translate(`claim.${claim.identifier}`);
    return { ...claim, label };
  }

  private hasLabel(claim: RichClaimInterface): boolean {
    return Boolean(claim.label);
  }

  private isIdentityClaim(claim: RichClaimInterface): boolean {
    const identityProviders: Providers[] = [
      Providers.FCP_HIGH,
      Providers.FCP_LOW,
    ];

    const result = identityProviders.includes(claim.provider.slug as Providers);

    return result;
  }

  private dataProviderOrder(
    a: RichClaimInterface[],
    b: RichClaimInterface[],
  ): number {
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
    groups: Record<string, RichClaimInterface[]>,
    claim: RichClaimInterface,
  ): void {
    if (!groups[claim.provider.slug]) {
      groups[claim.provider.slug] = [];
    }

    groups[claim.provider.slug].push(claim);
  }
}
