import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LoggerService } from '@fc/logger';
import { UserPreferencesProtocol } from '@fc/microservices';

import { GetIdpSettingsPayloadDto, SetIdpSettingsPayloadDto } from '../dto';
import { IFormattedIdpSettingsResponse } from '../interfaces';
import { CsmrUserPreferencesService } from '../services';

@Controller()
export class CsmrUserPreferencesController {
  constructor(
    private readonly logger: LoggerService,
    private readonly userPreferencesCsmr: CsmrUserPreferencesService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Get the account idpSettings
   * @param {GetIdpSettingsPayloadDto} payload
   * @returns {Promise<IFormattedIdpSettingsResponse>}
   */
  @MessagePattern(UserPreferencesProtocol.Commands.GET_IDP_SETTINGS)
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  )
  async getIdpSettings(
    @Payload() payload: GetIdpSettingsPayloadDto,
  ): Promise<IFormattedIdpSettingsResponse> {
    this.logger.debug(
      `New message pattern received ${UserPreferencesProtocol.Commands.GET_IDP_SETTINGS}`,
    );

    let idpSettings;
    const { identity } = payload;
    try {
      idpSettings = await this.userPreferencesCsmr.getIdpSettings(identity);
    } catch (error) {
      this.logger.trace({ error, payload });
      return 'ERROR';
    }

    this.logger.trace({
      input: { payload },
      name: 'UserPreferencesProtocol.Commands.GET_IDP_SETTINGS',
      output: idpSettings,
      pattern: UserPreferencesProtocol.Commands.GET_IDP_SETTINGS,
    });

    return idpSettings;
  }

  /**
   * Update the specific account idpSettings
   * @param {SetIdpSettingsPayloadDto} payload
   * @returns {Promise<IFormattedIdpSettingsResponse>}
   */
  @MessagePattern(UserPreferencesProtocol.Commands.SET_IDP_SETTINGS)
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  )
  async setIdpSettings(
    @Payload() payload: SetIdpSettingsPayloadDto,
  ): Promise<IFormattedIdpSettingsResponse> {
    this.logger.debug(
      `New message pattern received ${UserPreferencesProtocol.Commands.SET_IDP_SETTINGS}`,
    );

    let updatedIdpSettings;
    const { identity, idpSettings } = payload;
    try {
      updatedIdpSettings = await this.userPreferencesCsmr.setIdpSettings(
        identity,
        idpSettings.idpList,
        idpSettings.allowFutureIdp,
      );
    } catch (error) {
      this.logger.trace({ error });
      return 'ERROR';
    }

    this.logger.trace({
      pattern: UserPreferencesProtocol.Commands.SET_IDP_SETTINGS,
      name: 'UserPreferencesProtocol.Commands.SET_IDP_SETTINGS',
      input: { payload },
      output: { updatedIdpSettings },
    });

    return updatedIdpSettings;
  }
}
