import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FSA } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import {
  ISessionService,
  Session,
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
} from '@fc/session';
import { TracksService } from '@fc/tracks';
import {
  FormattedIdpSettingDto,
  UserPreferencesService,
} from '@fc/user-preferences';

import { GetUserTracesQueryDto, UserPreferencesBodyDto } from '../dto';
import { UserDashboardBackRoutes } from '../enums';
import { HttpErrorResponse } from '../interfaces';
import { UserDashboardService } from '../services';

@Injectable()
@Controller()
export class UserDashboardController {
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly csrfService: SessionCsrfService,
    private readonly tracks: TracksService,
    private readonly userPreferences: UserPreferencesService,
    private readonly userDashboard: UserDashboardService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(UserDashboardBackRoutes.CSRF_TOKEN)
  async getCsrfToken(
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<{ csrfToken: string }> {
    this.logger.debug('getCsrfToken()');
    const csrfToken = this.csrfService.get();
    await this.csrfService.save(sessionOidc, csrfToken);

    return { csrfToken };
  }

  @Get(UserDashboardBackRoutes.TRACKS)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getUserTraces(
    @Res({ passthrough: true }) res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Query() query: GetUserTracesQueryDto,
  ): Promise<FSA | HttpErrorResponse> {
    this.logger.debug(`getUserTraces() with ${query}`);
    const idpIdentity = await sessionOidc.get('idpIdentity');
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    this.logger.trace({ idpIdentity });
    const tracks = await this.tracks.getList(idpIdentity, query);
    this.logger.trace({ tracks });

    return {
      type: 'TRACKS_DATA',
      ...tracks,
    };
  }

  @Get(UserDashboardBackRoutes.USER_INFOS)
  async getUserInfos(
    @Res({ passthrough: true }) res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<{ firstname: string; lastname: string } | HttpErrorResponse> {
    this.logger.debug('getUserInfos()');
    const idpIdentity = await sessionOidc.get('idpIdentity');
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const firstname = idpIdentity?.given_name;
    const lastname = idpIdentity?.family_name;

    this.logger.trace({ firstname, lastname });
    return { firstname, lastname };
  }

  @Get(UserDashboardBackRoutes.USER_PREFERENCES)
  async getUserPreferences(
    @Res({ passthrough: true }) res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<FormattedIdpSettingDto | HttpErrorResponse> {
    const idpIdentity = await sessionOidc.get('idpIdentity');
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const preferences = await this.userPreferences.getUserPreferencesList(
      idpIdentity,
    );

    return preferences;
  }

  @Post(UserDashboardBackRoutes.USER_PREFERENCES)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUserPreferences(
    @Res({ passthrough: true }) res,
    @Body() body: UserPreferencesBodyDto,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<FormattedIdpSettingDto | HttpErrorResponse> {
    const idpIdentity = await sessionOidc.get('idpIdentity');
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const { csrfToken, idpList, allowFutureIdp } = body;

    // -- control if the CSRF provided is the same as the one previously saved in session.
    try {
      await this.csrfService.validate(sessionOidc, csrfToken);
    } catch (error) {
      this.logger.trace({ error });

      throw new SessionInvalidCsrfSelectIdpException(error);
    }

    const preferences = await this.userPreferences.setUserPreferencesList(
      idpIdentity,
      { idpList, allowFutureIdp },
    );

    const {
      email,
      given_name: givenName,
      family_name: familyName,
    } = idpIdentity;

    const {
      idpList: formattedIdpSettingsList,
      allowFutureIdp: updatedAllowFutureIdp,
      updatedIdpSettingsList,
      hasAllowFutureIdpChanged,
      updatedAt,
    } = preferences;

    if (email) {
      await this.userDashboard.sendMail(
        {
          email,
          givenName,
          familyName,
        },
        {
          formattedIdpSettingsList,
          updatedIdpSettingsList,
          hasAllowFutureIdpChanged,
          allowFutureIdp: updatedAllowFutureIdp,
          updatedAt,
        },
      );
    }

    return preferences;
  }
}
