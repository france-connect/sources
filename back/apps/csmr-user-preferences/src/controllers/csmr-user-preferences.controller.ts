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
  ) {}

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
      this.logger.err(error);
      return 'ERROR';
    }

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
      const {
        formattedIdpSettingsList,
        updatedIdpSettingsList,
        hasAllowFutureIdpChanged,
        updatedAt,
      } = await this.userPreferencesCsmr.setIdpSettings(
        identity,
        idpSettings.idpList,
        idpSettings.allowFutureIdp,
      );

      updatedIdpSettings = {
        allowFutureIdp: idpSettings.allowFutureIdp,
        idpList: formattedIdpSettingsList,
        updatedIdpSettingsList,
        hasAllowFutureIdpChanged,
        updatedAt,
      };
    } catch (error) {
      this.logger.err(error);
      this.logger.debug(idpSettings);
      return 'ERROR';
    }

    return updatedIdpSettings;
  }
}
