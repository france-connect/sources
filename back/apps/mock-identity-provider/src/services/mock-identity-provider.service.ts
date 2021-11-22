import * as crypto from 'crypto';

import { parseFile, ParserOptionsArgs } from '@fast-csv/parse';
import * as _ from 'lodash';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import {
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterEnvService } from '@fc/service-provider-adapter-env';
import { ISessionBoundContext, SessionService } from '@fc/session';

import { AppConfig } from '../dto';
import { Csv } from '../interfaces';
import { OidcClaims } from '../interfaces/oidc-claims.interface';

@Injectable()
export class MockIdentityProviderService {
  private database: Csv[];

  // Authorized in constructors
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
    private readonly serviceProvider: ServiceProviderAdapterEnvService,
    private readonly sessionService: SessionService,
    private readonly config: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    this.loadDatabase();
    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.AUTHORIZATION,
      this.authorizationMiddleware.bind(this),
    );
  }

  private async authorizationMiddleware(ctx) {
    /**
     * Abort middleware if authorize is in error
     *
     * We do not want to start a session
     * nor trigger authorization event for invalid requests
     */
    if (ctx.oidc['isError'] === true) {
      return;
    }

    const { sessionId } = ctx.req;
    const interactionId = this.oidcProvider.getInteractionIdFromCtx(ctx);

    // oidc defined variable name
    const { client_id: spId, acr_values: spAcr } = ctx.oidc.params;

    const { name: spName } = await this.serviceProvider.getById(spId);

    const sessionProperties: OidcSession = {
      interactionId,
      spId,
      spAcr,
      spName,
    };

    const boundSessionContext: ISessionBoundContext = {
      sessionId,
      moduleName: 'OidcClient',
    };
    const saveWithContext = this.sessionService.set.bind(
      this.sessionService,
      boundSessionContext,
    );
    await saveWithContext(sessionProperties);
  }

  private async loadDatabase(): Promise<void> {
    /**
     * @todo #307 Config this path
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/307
     */
    const { citizenDatabasePath } = this.config.get<AppConfig>('App');

    try {
      this.logger.debug('Loading database...');

      const database = await this.parseCsv(citizenDatabasePath, {
        trim: true,
        ignoreEmpty: true,
        headers: true,
      });

      // remove empty properties
      database.forEach((entry) => {
        const cleaner = (key) => entry[key] === '' && delete entry[key];
        Object.keys(entry).forEach(cleaner);
      });

      this.database = database;
    } catch (error) {
      this.logger.fatal(
        `Failed to load CSV database, path was: ${citizenDatabasePath}`,
      );
      throw error;
    }

    this.logger.debug(
      `Database loaded (${this.database.length} entries found)`,
    );
  }

  getIdentity(inputLogin: string) {
    const identity: Csv = this.database.find(
      ({ login }) => login === inputLogin,
    );

    if (!identity) {
      return;
    }

    return this.toOidcFormat(identity);
  }

  private toOidcFormat(identity: Csv): OidcClaims {
    // This copy works because "Csv" type only contains strings. Beware !
    const identityCopy = {
      ...identity,
    };

    const sub = crypto
      .createHash('sha256')
      .update(identity.login)
      .digest('hex');
    identityCopy.sub = sub;
    delete identityCopy.login;

    if (this.oidcAddressFieldPresent(identityCopy)) {
      return this.formatOidcAddress(identityCopy) as OidcClaims;
    }

    return identityCopy as OidcClaims;
  }

  private formatOidcAddress(identity: Csv): Partial<OidcClaims> {
    const oidcIdentity: Partial<OidcClaims> = _.omit(identity, [
      'country',
      'postal_code',
      'locality',
      'street_address',
    ]);

    // oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { country, postal_code, locality, street_address } = identity;
    oidcIdentity.address = {
      country,
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      postal_code,
      locality,
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      street_address,
      formatted: `${country} ${locality} ${postal_code} ${street_address}`,
    };

    return oidcIdentity;
  }

  private oidcAddressFieldPresent(identity: Csv) {
    return Boolean(
      identity.country ||
        identity.postal_code ||
        identity.locality ||
        identity.street_address,
    );
  }

  private async parseCsv(
    file: string,
    opts: ParserOptionsArgs,
  ): Promise<Csv[]> {
    const rows: Csv[] = [];

    return new Promise((resolve, reject) => {
      parseFile(file, opts)
        .on('error', reject)
        .on('data', (data) => rows.push(data))
        .on('end', () => resolve(rows));
    });
  }
}
