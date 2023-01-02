import * as crypto from 'crypto';

import * as _ from 'lodash';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import {
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterEnvService } from '@fc/service-provider-adapter-env';
import { ISessionBoundContext, SessionService } from '@fc/session';

import { AppConfig } from '../dto';
import { getFilesPathsFromDir, parseCsv } from '../helpers';
import { Csv, OidcClaims } from '../interfaces';

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
    this.loadDatabases();

    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.AUTHORIZATION,
      this.authorizationMiddleware.bind(this),
    );
  }

  private shouldAbortMiddleware({ oidc }): boolean {
    /**
     * Abort middleware if authorize is in error
     *
     * We do not want to start a session
     * nor trigger authorization event for invalid requests
     */
    const abort =
      oidc['isError'] === true || 'AuthorizationCode' in oidc.entities;
    return abort;
  }

  private async authorizationMiddleware(ctx) {
    if (this.shouldAbortMiddleware(ctx)) {
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

  private async loadDatabases(): Promise<void> {
    /**
     * @todo #307 Config this path
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/307
     */
    const { citizenDatabasePath } = this.config.get<AppConfig>('App');

    const paths = getFilesPathsFromDir(citizenDatabasePath);

    const allFiles = await Promise.all(
      paths.map((path) => this.loadDatabase(path)),
    );

    this.database = allFiles.flat();

    this.logger.debug(
      `Database loaded (${this.database.length} entries found)`,
    );
  }

  private async loadDatabase(path: string): Promise<Csv[]> {
    try {
      this.logger.debug('Loading database...');

      const database = await parseCsv(path, {
        trim: true,
        ignoreEmpty: true,
        headers: true,
      });

      // remove empty properties
      database.forEach((entry) => {
        const cleaner = (key) => entry[key] === '' && delete entry[key];
        Object.keys(entry).forEach(cleaner);
      });

      return database;
    } catch (error) {
      this.logger.fatal(`Failed to load CSV database, path was: ${path}`);
      throw error;
    }
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
}
