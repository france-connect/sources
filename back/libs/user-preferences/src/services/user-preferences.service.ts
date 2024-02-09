import { lastValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { UserPreferencesProtocol } from '@fc/microservices';
import { IOidcIdentity } from '@fc/oidc';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { FormattedIdpSettingDto, IdpSettingsDto } from '../dto';
import {
  GetUserPreferencesConsumerErrorException,
  GetUserPreferencesResponseException,
  SetUserPreferencesConsumerErrorException,
  SetUserPreferencesResponseException,
} from '../exceptions';

@Injectable()
export class UserPreferencesService {
  constructor(
    private readonly config: ConfigService,
    @Inject('UserPreferencesBroker') private readonly broker: ClientProxy,
  ) {}

  async getUserPreferencesList(
    identity: Partial<IOidcIdentity>,
  ): Promise<FormattedIdpSettingDto> {
    let data;
    const { requestTimeout } = this.config.get<RabbitmqConfig>(
      'UserPreferencesBroker',
    );

    try {
      const order = this.broker
        .send(UserPreferencesProtocol.Commands.GET_IDP_SETTINGS, {
          identity,
        })
        .pipe(timeout(requestTimeout));

      data = await lastValueFrom(order);
    } catch (error) {
      throw new GetUserPreferencesResponseException(error);
    }

    if (data === 'ERROR') {
      throw new GetUserPreferencesConsumerErrorException();
    }
    return data;
  }

  async setUserPreferencesList(
    identity: Partial<IOidcIdentity>,
    idpSettings: IdpSettingsDto,
  ): Promise<FormattedIdpSettingDto> {
    let data;
    const { requestTimeout } = this.config.get<RabbitmqConfig>(
      'UserPreferencesBroker',
    );

    try {
      const order = this.broker
        .send(UserPreferencesProtocol.Commands.SET_IDP_SETTINGS, {
          identity,
          idpSettings,
        })
        .pipe(timeout(requestTimeout));

      data = await lastValueFrom(order);
    } catch (error) {
      throw new SetUserPreferencesResponseException(error);
    }

    if (data === 'ERROR') {
      throw new SetUserPreferencesConsumerErrorException();
    }

    return data;
  }
}
