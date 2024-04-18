/* istanbul ignore file */

// Declarative file
import { NotificationInterface } from '@fc/notifications';
import { IdentityProviderMetadata } from '@fc/oidc';

export interface InteractionResponseInterface {
  csrfToken: string;
  notification: NotificationInterface;
  params: any;
  providers: IdentityProviderMetadata[];
  aidantsConnect: IdentityProviderMetadata | undefined;
  spName: string | null;
  spScope: string;
  errorContext: ErrorContextInterface;
}

interface ErrorContextInterface {
  hasError: boolean;
  idpLabel: string | null;
}
