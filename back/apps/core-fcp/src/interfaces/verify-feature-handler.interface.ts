/* istanbul ignore file */

// Declarative code
import { IFeatureHandler } from '@fc/feature-handler';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

export interface IVerifyFeatureHandlerHandleArgument {
  sessionOidc: ISessionService<OidcClientSession>;
  trackingContext: Record<string, unknown>;
}
export interface IVerifyFeatureHandler
  extends IFeatureHandler<void, IVerifyFeatureHandlerHandleArgument> {
  /**
   * Override default handler.handle argument type
   */
  handle(options: IVerifyFeatureHandlerHandleArgument): Promise<void>;
}
