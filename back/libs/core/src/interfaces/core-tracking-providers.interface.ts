/* istanbul ignore file */

// Declarative code
export interface ICoreTrackingProviders {
  readonly accountId: string | null;
  readonly sessionId: string | null;
  readonly interactionId: string | null;
  readonly isSso: boolean;

  readonly spId: string | null;
  readonly spAcr: string | null;
  readonly spName: string | null;
  readonly spSub: string | null;

  readonly idpId: string | null;
  readonly idpAcr: string | null;
  readonly idpName: string | null;
  readonly idpSub: string | null;
  readonly idpLabel: string | null;
}
