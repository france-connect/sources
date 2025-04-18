import { OidcIdentityDto } from '@fc/oidc';
import { NetworkContextInterface } from '@fc/tracking-context';

export interface ICoreTrackingContext {
  readonly source: NetworkContextInterface;
  readonly accountId?: string;
  readonly browsingSessionId?: string;
  readonly sessionId: string;

  readonly isSso?: boolean;
  readonly interactionId: string;
  readonly claims?: string[];
  readonly scope?: string;

  readonly dpId?: string;
  readonly dpTitle?: string;
  readonly dpClientId?: string;

  readonly spId?: string;
  readonly spAcr?: string;
  readonly spName?: string;
  readonly spType?: undefined;

  readonly idpId?: string;
  readonly idpAcr?: string;
  readonly idpName?: string;
  readonly idpLabel?: string;
  readonly idpIdentity?: OidcIdentityDto;

  readonly deviceTrusted?: boolean;
  readonly deviceIsSuspicious?: boolean;

  readonly deviceAccountCount?: number;

  readonly deviceKnown?: boolean;
  readonly deviceNewIdentity?: boolean;
  readonly deviceBecameTrusted?: boolean;
  readonly deviceBecameShared?: boolean;
}
