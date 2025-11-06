import { Injectable } from '@nestjs/common';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import { getTransformed } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import { ServiceProviderInstanceVersionDto } from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';

import { AppConfig, DefaultServiceProviderLowValueConfig } from '../dto';
import { ExistingDataInterface } from '../interfaces';

@Injectable()
export class PartnersInstanceVersionFormService {
  constructor(
    private readonly config: ConfigService,
    private readonly instance: PartnersServiceProviderInstanceService,
    private readonly crypto: CryptographyService,
  ) {}

  /**
   * Get a full OidcClientInterface from the posted values.
   * Default or private values are set in the returned object
   */
  async fromFormValues(
    values: ServiceProviderInstanceVersionDto,
    instanceId?: string,
  ): Promise<OidcClientInterface> {
    const DefaultServiceProviderLowValue =
      this.config.get<DefaultServiceProviderLowValueConfig>(
        'DefaultServiceProviderLowValue',
      );

    const { mutable, immutable } = await this.getOrGenerateValues(instanceId);

    const output = {
      ...DefaultServiceProviderLowValue,
      ...mutable,
      ...values,
      ...immutable,
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
    const { versions } = await this.instance.getById(instanceId);

    const { data: mutable } = versions[0];

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

  /**
   * Get an object with only relevants values for the form.
   * Private values are removed from the returned object
   */
  toFormValues(
    instance: PartnersServiceProviderInstance,
  ): PartnersServiceProviderInstance {
    return {
      ...instance,
      versions: instance.versions.map((version) => {
        version.data = getTransformed<OidcClientInterface>(
          version.data,
          ServiceProviderInstanceVersionDto,
          { excludeExtraneousValues: true },
        );

        return version;
      }),
    };
  }
}
