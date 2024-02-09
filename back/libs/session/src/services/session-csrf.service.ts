import { Injectable } from '@nestjs/common';

import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

/**
 * @todo Pouvoir utiliser une fonctionnalité anti-CSRF simplement et en évitant de dupliquer du code et les tests liés.
 *        - `session` n'est pas le meilleurs endroit on fairait mieux d'avoir une lib indépendante.
 *        - Enregistrer le CSRF dans oidcClient n'est pas le bon endroit, la session devrait avoir un endpoint spécific pour les CSRF.
 *        - On peut utiliser directement le décorateur faisant référence a la nouvelle librairie:
 *           `@Session('csrf') csrfService`
 *           `csrfService.set({ csrfToken });`
 * @author Hugues
 * @date 14/06/2021
 * @ticket FC-572
 */
@Injectable()
export class SessionCsrfService {
  constructor(
    private readonly logger: LoggerService,
    private readonly cryptography: CryptographyService,
  ) {}

  /**
   * @TODO #203
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/203
   */
  get(): string {
    const csrfTokenLength = 32;
    const csrfToken: string =
      this.cryptography.genRandomString(csrfTokenLength);
    return csrfToken;
  }

  async save(
    sessionOidc: ISessionService<OidcClientSession>,
    csrfToken: string,
  ): Promise<boolean> {
    return await sessionOidc.set({ csrfToken });
  }

  async validate(
    sessionOidc: ISessionService<OidcClientSession>,
    csrfToken: string,
  ): Promise<boolean> {
    const { csrfToken: csrfTokenSession }: OidcSession =
      await sessionOidc.get();

    if (csrfToken !== csrfTokenSession) {
      this.logger.err({ csrfToken, csrfTokenSession }, 'Invalid CSRF token');
      throw new Error(
        'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
      );
    }

    return true;
  }
}
