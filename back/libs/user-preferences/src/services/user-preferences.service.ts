import { lastValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { UserPreferencesProtocol } from '@fc/microservices';
import { IOidcIdentity } from '@fc/oidc';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { IdpSettingsDto, UserPreferencesDto } from '../dto';
import {
  GetUserPreferencesConsumerErrorException,
  GetUserPreferencesResponseException,
  SetUserPreferencesConsumerErrorException,
  SetUserPreferencesResponseException,
} from '../exceptions';

@Injectable()
export class UserPreferencesService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject('UserPreferencesBroker') private readonly broker: ClientProxy,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getUserPreferencesList(
    identity: Partial<IOidcIdentity>,
  ): Promise<UserPreferencesDto[]> {
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
      this.logger.trace(error, 'Error Response from RabbitMQ');
      throw new GetUserPreferencesResponseException(error);
    }

    if (data === 'ERROR') {
      this.logger.trace(
        'Consumer has returned an ERROR while trying to get identity provider list (GET). Check consumer logs.',
      );
      throw new GetUserPreferencesConsumerErrorException();
    }
    return data;
  }

  async setUserPreferencesList(
    identity: Partial<IOidcIdentity>,
    idpSettings: IdpSettingsDto,
  ): Promise<UserPreferencesDto[]> {
    let data;
    const { requestTimeout } = this.config.get<RabbitmqConfig>(
      'UserPreferencesBroker',
    );
    this.logger.trace({ idpSettings });

    try {
      const order = this.broker
        .send(UserPreferencesProtocol.Commands.SET_IDP_SETTINGS, {
          identity,
          idpSettings,
        })
        .pipe(timeout(requestTimeout));

      data = await lastValueFrom(order);
    } catch (error) {
      this.logger.trace(error, 'Error Response from RabbitMQ');
      throw new SetUserPreferencesResponseException(error);
    }

    if (data === 'ERROR') {
      this.logger.trace(
        'Consumer has returned an ERROR while trying to update identity provider list (SET). Check consumer logs.',
      );
      throw new SetUserPreferencesConsumerErrorException();
    }

    return data;
  }
}
