import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcProviderService } from '@fc/oidc-provider';

import {
  CoreHighAcrException,
  CoreInvalidAcrException,
  CoreLowAcrException,
} from '../exceptions';

@Injectable()
export class CoreAcrService {
  constructor(
    protected readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
    private readonly oidcAcr: OidcAcrService,
  ) {}

  async rejectInvalidAcr(
    currentAcrValue: string,
    allowedAcrValues: string[],
    { req, res }: { req: any; res: any },
  ): Promise<boolean> {
    const isAllowed = allowedAcrValues.includes(currentAcrValue);

    if (isAllowed) {
      return false;
    }

    const error = 'invalid_acr';
    const allowedAcrValuesString = allowedAcrValues.join(',');
    const errorDescription = `acr_value is not valid, should be equal one of these values, expected ${allowedAcrValuesString}, got ${currentAcrValue}`;

    this.logger.err('Invalid given ACR value %s', currentAcrValue);
    this.logger.debug(
      `Aborting interaction with error = "${error}" and error_description = "${errorDescription}"`,
    );

    await this.oidcProvider.abortInteraction(req, res, error, errorDescription);

    return true;
  }

  // eslint-disable-next-line complexity
  checkIfAcrIsValid(
    received: string,
    requested: string,
    maxAuthorizedAcr: string,
  ): void {
    /**
     * @todo #494
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/494
     */
    if (!received || !requested) {
      this.logger.crit(
        `Missing at least one ACR value: received = "${received}", requested = "${requested}"`,
      );
      throw new CoreInvalidAcrException();
    }

    if (!this.oidcAcr.isAcrValid(received, requested)) {
      this.logger.err(
        `Received ACR value "${received}" is lower than requested "${requested}"`,
      );
      throw new CoreLowAcrException();
    }

    if (!this.oidcAcr.isAcrValid(maxAuthorizedAcr, received)) {
      this.logger.err(
        `Received ACR value "${received}" is higher than max authorized "${maxAuthorizedAcr}"`,
      );
      throw new CoreHighAcrException();
    }
  }
}
