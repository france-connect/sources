import { Injectable } from '@nestjs/common';

import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcProviderService } from '@fc/oidc-provider';

import { CoreInvalidAcrException, CoreLowAcrException } from '../exceptions';

@Injectable()
export class CoreAcrService {
  constructor(
    protected readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
    private readonly oidcAcr: OidcAcrService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async rejectInvalidAcr(
    currentAcrValue: string,
    allowedAcrValues: string[],
    { req, res }: { req: any; res: any },
  ): Promise<boolean> {
    const isAllowed = allowedAcrValues.includes(currentAcrValue);

    if (isAllowed) {
      this.logger.trace({ isAllowed, currentAcrValue, allowedAcrValues });
      return false;
    }

    const error = 'invalid_acr';
    const allowedAcrValuesString = allowedAcrValues.join(',');
    const errorDescription = `acr_value is not valid, should be equal one of these values, expected ${allowedAcrValuesString}, got ${currentAcrValue}`;

    await this.oidcProvider.abortInteraction(req, res, error, errorDescription);

    this.logger.trace(
      { isAllowed, currentAcrValue, allowedAcrValues },
      LoggerLevelNames.WARN,
    );

    return true;
  }

  checkIfAcrIsValid(received: string, requested: string): void {
    /**
     * @todo #494
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/494
     */
    if (!received || !requested) {
      this.logger.trace(
        { error: 'received or requested ACR missing' },
        LoggerLevelNames.WARN,
      );
      throw new CoreInvalidAcrException();
    }

    if (!this.oidcAcr.isAcrValid(received, requested)) {
      this.logger.trace(
        { error: 'received ACR lower than requested' },
        LoggerLevelNames.WARN,
      );
      throw new CoreLowAcrException();
    }
  }
}
