import { ValidatorOptions } from 'class-validator';

import { Inject, Injectable } from '@nestjs/common';

import { countOccurrences, splitInTwoParts, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { ConfigMongoAdapterService } from '@fc/config-mongo-adapter';
import {
  ActionTypes as ActionTypesConfig,
  ConfigCreateMessageDtoPayload,
} from '@fc/csmr-config-client';
import {
  ActionTypes as ActionTypesHsm,
  CsmrHsmClientService,
} from '@fc/csmr-hsm-client';
import { CsmrImportCoreServiceProviderDto } from '@fc/csmr-import-core-client';
import { LoggerService } from '@fc/logger';
import { MicroservicesRmqConfig } from '@fc/microservices-rmq';
import { ScopesService } from '@fc/scopes';
import { ClientTypeEnum, PlatformTechnicalKeyEnum } from '@fc/service-provider';

import { DefaultServiceProviderLowValueConfig } from '../dto';
import { RANDOM_LENGTH, Status } from '../enums';
import {
  CsmrImportCoreExecutionReportInterface,
  CsmrImportCoreServiceProviderInterface,
} from '../interfaces';
import { CONFIG_DATABASE_SERVICE } from '../tokens';

@Injectable()
export class CsmrImportCoreService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject(CONFIG_DATABASE_SERVICE)
    private readonly configDatabaseAdapter: ConfigMongoAdapterService,
    @Inject('CsmrHsmClient')
    private readonly hsm: CsmrHsmClientService,
    private readonly scopesService: ScopesService,
  ) {}

  async validateAndCreateServiceProvider(
    serviceProviders: CsmrImportCoreServiceProviderDto[],
  ): Promise<CsmrImportCoreExecutionReportInterface[]> {
    const datapassIdCount = countOccurrences(serviceProviders, 'datapassId');
    const entityIdCount = countOccurrences(serviceProviders, 'entityId');

    const results = await Promise.all(
      serviceProviders.map(
        /*
         * We must use conditionnal chaining to avoid creation
         * when the service provider is not valid
         * */
        // eslint-disable-next-line complexity
        async (sp: CsmrImportCoreServiceProviderInterface) => {
          const duplicateSpStatus = this.validateIfDuplicateSp(
            datapassIdCount,
            entityIdCount,
            sp,
          );

          if (duplicateSpStatus) {
            const report = this.buildExecutionReport(
              sp,
              Status.ERROR,
              duplicateSpStatus,
            );

            return report;
          }

          const configErrors = await this.validateSpConfiguration(sp);
          if (configErrors) {
            const report = this.buildExecutionReport(
              sp,
              Status.ERROR,
              configErrors,
            );

            return report;
          }

          const errorMessage = await this.validateIfSpAlreadyExists(sp);
          if (errorMessage) {
            const report = this.buildExecutionReport(
              sp,
              Status.ERROR,
              errorMessage,
            );

            return report;
          }

          this.logger.info(
            `Service provider ${sp.name} does not exist, creating new one`,
          );

          try {
            const { client_id, client_secret } = await this.getCredentials();

            const payload = this.buildServiceProviderPayload(
              sp,
              client_id,
              client_secret,
            );

            await this.configDatabaseAdapter.create({
              type: ActionTypesConfig.CONFIG_CREATE,
              payload,
            });

            const report = this.buildExecutionReport(
              sp,
              Status.SUCCESS,
              'Service provider created',
              client_id,
              client_secret,
            );

            return report;
          } catch (error) {
            this.logger.warning(error);

            const report = this.buildExecutionReport(
              sp,
              Status.ERROR,
              `Error during creation : ${error.message}`,
            );

            return report;
          }
        },
      ),
    );

    return results;
  }

  private validateIfDuplicateSp(
    datapassIdCount: Record<string, number>,
    entityIdCount: Record<string, number>,
    { datapassId, entityId }: CsmrImportCoreServiceProviderInterface,
  ): string {
    const errors: string[] = [];

    if (datapassIdCount[datapassId] > 1) {
      errors.push('duplicate datapassId');
    }

    if (entityIdCount[entityId] > 1) {
      errors.push('duplicate entityId');
    }

    if (errors.length > 0) {
      return errors.join(' and ');
    }

    return '';
  }

  private async validateIfSpAlreadyExists({
    datapassId,
    entityId,
  }: CsmrImportCoreServiceProviderInterface): Promise<string | null> {
    const query = {
      platform: PlatformTechnicalKeyEnum.CORE_FCP,
      $or: [{ signup_id: datapassId }, { entityId }],
    };

    let errorMessage = '';
    try {
      const serviceProvider =
        await this.configDatabaseAdapter.findOneSpByQuery(query);

      if (serviceProvider) {
        errorMessage = `Already present in the database (client_id '${serviceProvider.key}')`;
      }
    } catch (error) {
      this.logger.debug(error);
      errorMessage = `error during existence verification: ${error.message}`;
    }

    return errorMessage;
  }

  private async validateSpConfiguration(
    serviceProvier: CsmrImportCoreServiceProviderInterface,
  ): Promise<string> {
    const validatorOptions: ValidatorOptions = {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    };
    const errors = await validateDto(
      serviceProvier,
      CsmrImportCoreServiceProviderDto,
      validatorOptions,
    );

    this.logger.debug({ errors });

    const propertiesError = errors
      .map((item) => item?.property)
      .filter(Boolean)
      .join(', ');

    return propertiesError;
  }

  private async getCredentials(): Promise<
    Pick<ConfigCreateMessageDtoPayload, 'client_id' | 'client_secret'>
  > {
    const { payloadEncoding } = this.config.get<MicroservicesRmqConfig>(
      'CsmrHsmClientMicroService',
    );

    const message = {
      type: ActionTypesHsm.RANDOM_MICROSERVICE,
      payload: {
        length: RANDOM_LENGTH,
        encoding: payloadEncoding,
      },
    };

    const { payload } = await this.hsm.random(message);

    const [client_id, client_secret] = splitInTwoParts(payload);
    return { client_id, client_secret };
  }

  // We don't want to pass an object otherwise the method is no longer of any interest
  // eslint-disable-next-line max-params
  private buildExecutionReport(
    serviceProvider: CsmrImportCoreServiceProviderInterface,
    status: Status,
    comments: string,
    client_id = '',
    client_secret = '',
  ): CsmrImportCoreExecutionReportInterface {
    return {
      ...serviceProvider,
      status,
      comments,
      client_id,
      client_secret,
    };
  }

  private buildServiceProviderPayload(
    serviceProvider: CsmrImportCoreServiceProviderInterface,
    client_id: string,
    client_secret: string,
  ): ConfigCreateMessageDtoPayload {
    const {
      rep_scope,
      idpFilterExclude,
      idpFilterList,
      active,
      claims,
      id_token_encrypted_response_alg,
      id_token_encrypted_response_enc,
      userinfo_encrypted_response_alg,
      userinfo_encrypted_response_enc,
      platform,
      eidas,
    } = this.config.get<DefaultServiceProviderLowValueConfig>(
      'DefaultServiceProviderLowValue',
    );

    const scope = this.normalizeScopes(serviceProvider.scopes);

    return {
      client_id,
      client_secret,

      name: serviceProvider.name,
      type: serviceProvider.type,
      emails: serviceProvider.email,
      signupId: serviceProvider.datapassId,
      IPServerAddressesAndRanges: serviceProvider.adressesIp,
      redirect_uris: serviceProvider.redirect_uris,
      post_logout_redirect_uris: serviceProvider.post_logout_redirect_uris,
      scope,
      id_token_signed_response_alg:
        serviceProvider.userinfo_signed_response_alg,
      userinfo_signed_response_alg:
        serviceProvider.userinfo_signed_response_alg,
      site: serviceProvider.site,

      entityId: serviceProvider.entityId || client_id,
      rep_scope,
      idpFilterExclude,
      idpFilterList,
      active,
      claims,
      identityConsent:
        serviceProvider.type === ClientTypeEnum.PUBLIC ? false : true,
      id_token_encrypted_response_alg,
      id_token_encrypted_response_enc,
      userinfo_encrypted_response_alg,
      userinfo_encrypted_response_enc,
      platform,
      eidas,
    };
  }

  /**
   * Normalizes the scopes by adding composite scopes if necessary.
   *
   * @param scopes - The list of scopes to normalize.
   * @returns The normalized list of scopes.
   */
  private normalizeScopes(scopes: string[]): string[] {
    const baseScopes = Array.from(new Set(['openid', ...scopes]));

    const claims = this.scopesService.getRawClaimsFromScopes(baseScopes);
    const scopesToAdd = this.scopesService.getScopesFromClaims(claims);

    return scopesToAdd;
  }
}
