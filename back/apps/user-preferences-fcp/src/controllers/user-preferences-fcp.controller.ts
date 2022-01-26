import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LoggerService } from '@fc/logger';
import { UserPreferencesFcpProtocol } from '@fc/microservices';

import { GetIdpSettingsPayloadDto, SetIdpSettingsPayloadDto } from '../dto';
import { IIdpSettingsResponse } from '../interfaces';
import { UserPreferencesFcpService } from '../services';

@Controller()
export class UserPreferencesFcpController {
  constructor(
    private readonly logger: LoggerService,
    private readonly userPreferencesFcp: UserPreferencesFcpService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Get the account idpSettings
   * @param {GetIdpSettingsPayloadDto} payload
   * @returns {Promise<IIdpSettingsResponse>}
   */
  @MessagePattern(UserPreferencesFcpProtocol.Commands.GET_IDP_SETTINGS)
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  )
  async getIdpSettings(
    @Payload() payload: GetIdpSettingsPayloadDto,
  ): Promise<IIdpSettingsResponse> {
    this.logger.debug(
      `New message pattern received ${UserPreferencesFcpProtocol.Commands.GET_IDP_SETTINGS}`,
    );

    let idpSettings;
    const { identity } = payload;
    try {
      idpSettings = await this.userPreferencesFcp.getIdpSettings(identity);
    } catch (error) {
      this.logger.trace({ error, payload });
      return 'ERROR';
    }

    this.logger.trace({
      input: { payload },
      name: 'UserPreferencesFcpProtocol.Commands.GET_IDP_SETTINGS',
      output: idpSettings,
      pattern: UserPreferencesFcpProtocol.Commands.GET_IDP_SETTINGS,
    });

    return idpSettings;
  }

  /**
   * @todo #FC-779
   * We should ensure here if idpSettings in payload are matching an idp uid in database.
   * We tried to use IdentityProviderAdapterMongoService.getList() to get those uid, nevertheless
   * a specific config is needed (featureHandlers) to use it.
   * Author: Annouar LAIFA
   * Date: 31/11/2021
   */
  /**
   * Update the specific account idpSettings
   * @param {SetIdpSettingsPayloadDto} payload
   * @returns {Promise<IUserPreferencesFcpResponse>}
   */
  @MessagePattern(UserPreferencesFcpProtocol.Commands.SET_IDP_SETTINGS)
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  )
  async setIdpSettings(
    @Payload() payload: SetIdpSettingsPayloadDto,
  ): Promise<IIdpSettingsResponse> {
    this.logger.debug(
      `New message pattern received ${UserPreferencesFcpProtocol.Commands.SET_IDP_SETTINGS}`,
    );

    let updatedIdpSettings;
    const { identity, idpSettings } = payload;
    try {
      updatedIdpSettings = await this.userPreferencesFcp.setIdpSettings(
        identity,
        idpSettings.includeList,
      );
    } catch (error) {
      this.logger.trace({ error });
      return 'ERROR';
    }

    this.logger.trace({
      pattern: UserPreferencesFcpProtocol.Commands.SET_IDP_SETTINGS,
      name: 'UserPreferencesFcpProtocol.Commands.SET_IDP_SETTINGS',
      input: { payload },
      output: { updatedIdpSettings },
    });

    return updatedIdpSettings;
  }
}
