import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

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

import { UserPreferencesBodyDto } from '../dto/user-preferences-body.dto';
import { UserDashboardBackRoutes } from '../enums';
import { UserDashboardService } from '../services/user-dashboard.service';

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
  async getUserTraces(
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<unknown> {
    this.logger.debug('getUserTraces()');
    const session = await sessionOidc.get();
    if (!session) {
      throw new UnauthorizedException();
    }
    const { idpIdentity } = session;
    this.logger.trace({ idpIdentity });
    const tracks = await this.tracks.getList(idpIdentity);
    this.logger.trace({ tracks });
    return tracks;
  }

  @Get(UserDashboardBackRoutes.USER_INFOS)
  async getUserInfos(
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<{
    firstname: string;
    lastname: string;
  }> {
    this.logger.debug('getUserInfos()');
    const session = await sessionOidc.get();
    if (!session) {
      throw new UnauthorizedException();
    }
    const { idpIdentity } = session;

    const firstname = idpIdentity?.given_name;
    const lastname = idpIdentity?.family_name;

    this.logger.trace({ firstname, lastname });
    return { firstname, lastname };
  }

  @Get(UserDashboardBackRoutes.USER_PREFERENCES)
  async getUserPreferences(
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<FormattedIdpSettingDto> {
    const session = await sessionOidc.get();
    if (!session) {
      throw new UnauthorizedException();
    }
    const { idpIdentity } = session;

    const preferences = await this.userPreferences.getUserPreferencesList(
      idpIdentity,
    );

    return preferences;
  }

  @Post(UserDashboardBackRoutes.USER_PREFERENCES)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUserPreferences(
    @Body() body: UserPreferencesBodyDto,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<FormattedIdpSettingDto> {
    const session = await sessionOidc.get();
    if (!session) {
      throw new UnauthorizedException();
    }
    const { csrfToken, idpList, allowFutureIdp } = body;

    // -- control if the CSRF provided is the same as the one previously saved in session.
    try {
      await this.csrfService.validate(sessionOidc, csrfToken);
    } catch (error) {
      this.logger.trace({ error });

      throw new SessionInvalidCsrfSelectIdpException(error);
    }

    const { idpIdentity } = session;

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
