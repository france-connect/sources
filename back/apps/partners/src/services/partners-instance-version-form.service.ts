import { Injectable } from '@nestjs/common';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import { getTransformed } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import { ServiceProviderInstanceVersionDto } from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';

import { AppConfig, DefaultServiceProviderLowValueConfig } from '../dto';

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

    const generatedValues = await this.getGeneratedValues(instanceId);

    const output = {
      ...DefaultServiceProviderLowValue,
      ...values,
      ...generatedValues,
    };

    return output;
  }

  private async getGeneratedValues(
    instanceId?: string,
  ): Promise<Pick<OidcClientInterface, 'client_id' | 'client_secret'>> {
    if (instanceId) {
      return await this.getCredentialsForInstance(instanceId);
    }

    return this.generateNewCredentials();
  }

  private async getCredentialsForInstance(
    instanceId: string,
  ): Promise<Pick<OidcClientInterface, 'client_id' | 'client_secret'>> {
    const { versions } = await this.instance.getById(instanceId);

    const { client_id, client_secret } = versions[0].data;

    return {
      client_id,
      client_secret,
    };
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
