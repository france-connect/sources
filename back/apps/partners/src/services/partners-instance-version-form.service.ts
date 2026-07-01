import { Injectable } from '@nestjs/common';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import { getTransformed } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { PartnersServiceProviderService } from '@fc/partners-service-provider';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import { ServiceProviderInstanceVersionStandaloneDto } from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';

import { AppConfig, DefaultServiceProviderLowValueConfig } from '../dto';
import {
  ExistingDataInterface,
  InstanceVersionFromSpPayloadInterface,
} from '../interfaces';
import { PartnersServiceProviderFormService } from './partners-service-provider-form.service';

@Injectable()
export class PartnersInstanceVersionFormService {
  // More than 4 parameters authorized for Dependency Injection
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly instance: PartnersServiceProviderInstanceService,
    private readonly crypto: CryptographyService,
    private readonly serviceProviderFormService: PartnersServiceProviderFormService,
    private readonly serviceProvider: PartnersServiceProviderService,
  ) {}

  /**
   * Get a full OidcClientInterface from the posted values.
   * Default or private values are set in the returned object
   */
  async fromFormValues(
    values:
      | ServiceProviderInstanceVersionStandaloneDto
      | InstanceVersionFromSpPayloadInterface
      | OidcClientInterface,
    serviceProviderId: string,
    instanceId?: string,
  ): Promise<OidcClientInterface> {
    const DefaultServiceProviderLowValue =
      this.config.get<DefaultServiceProviderLowValueConfig>(
        'DefaultServiceProviderLowValue',
      );

    const { mutable, immutable } = await this.getOrGenerateValues(instanceId);

    const scope = await this.getScopesForServiceProvider(serviceProviderId);

    const output = {
      ...DefaultServiceProviderLowValue,
      ...mutable,
      ...values,
      ...immutable,
      scope,
    };

    return output;
  }

  private async getOrGenerateValues(
    instanceId?: string,
  ): Promise<ExistingDataInterface> {
    if (instanceId) {
      return await this.getLatestVersionForInstance(instanceId);
    }

    const immutable = this.generateNewCredentials();

    return { immutable, mutable: {} };
  }

  private async getLatestVersionForInstance(
    instanceId: string,
  ): Promise<ExistingDataInterface> {
    const { currentVersion } = await this.instance.getById(instanceId);

    const { data: mutable } = currentVersion;

    const immutable = {
      client_id: mutable.client_id,
      client_secret: mutable.client_secret,
      /**
       * TMP fix for mass import
       * @todo remove once we have a cleaner way (clean up data ?)
       */
      idpFilterExclude: true,
    };

    return { mutable, immutable };
  }

  private generateNewCredentials(): Pick<
    OidcClientInterface,
    'client_id' | 'client_secret'
  > {
    const { credentialsBytesLength } = this.config.get<AppConfig>('App');

    return {
      client_id: this.crypto.genRandomString(credentialsBytesLength),
      client_secret: this.crypto.genRandomString(credentialsBytesLength),
    };
  }

  private async getScopesForServiceProvider(
    serviceProviderId: string,
  ): Promise<string[]> {
    const serviceProvider =
      await this.serviceProvider.getById(serviceProviderId);

    const { fcScopes } =
      this.serviceProviderFormService.toDisplayValue(serviceProvider);

    const DefaultServiceProviderLowValue =
      this.config.get<DefaultServiceProviderLowValueConfig>(
        'DefaultServiceProviderLowValue',
      );

    return [...fcScopes, ...DefaultServiceProviderLowValue.scope];
  }

  /**
   * Get an object with only relevants values for the form.
   * Private values are removed from the returned object
   */
  toFormValues(
    instance: PartnersServiceProviderInstance,
  ): PartnersServiceProviderInstance {
    return {
      ...instance,
      currentVersion: {
        ...instance.currentVersion,
        data: getTransformed<OidcClientInterface>(
          instance.currentVersion.data,
          ServiceProviderInstanceVersionStandaloneDto,
          { excludeExtraneousValues: true },
        ),
      },
    };
  }
}
