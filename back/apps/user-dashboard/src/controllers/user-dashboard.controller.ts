import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FSA, PartialExcept } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';
import { IOidcIdentity } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import {
  ISessionService,
  Session,
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
} from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';
import { TracksService } from '@fc/tracks';
import {
  FormattedIdpSettingDto,
  UserPreferencesService,
} from '@fc/user-preferences';

import { GetUserTracesQueryDto, UserPreferencesBodyDto } from '../dto';
import { UserDashboardBackRoutes } from '../enums';
import {
  HttpErrorResponse,
  OidcIdentityInterface,
  UserInfosInterface,
} from '../interfaces';
import { UserDashboardService } from '../services';

@Injectable()
@Controller()
export class UserDashboardController {
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly csrfService: SessionCsrfService,
    private readonly tracking: TrackingService,
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
    @Req() req: Request,
    @Res() res,
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

    await this.tracking.track(
      this.tracking.TrackedEventsMap.DISPLAYED_USER_TRACKS,
      {
        req,
        identity: idpIdentity,
      },
    );

    this.logger.trace({ idpIdentity });
    const tracks = await this.tracks.getList(idpIdentity, query);
    this.logger.trace({ tracks });

    return res.json({
      type: 'TRACKS_DATA',
      ...tracks,
    });
  }

  @Get(UserDashboardBackRoutes.USER_INFOS)
  async getUserInfos(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<UserInfosInterface | HttpErrorResponse> {
    this.logger.debug('getUserInfos()');
    /**
     * @Todo find better way to define interface
     * Author: Emmanuel Maravilha
     */
    const idpIdentity = (await sessionOidc.get(
      'idpIdentity',
    )) as OidcIdentityInterface;
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const {
      given_name: firstname,
      family_name: lastname,
      idp_id: idpId,
    } = idpIdentity;

    const userInfos = {
      firstname,
      lastname,
      idpId,
    };

    this.logger.trace({ userInfos });
    return res.json(userInfos);
  }

  @Get(UserDashboardBackRoutes.USER_PREFERENCES)
  async getUserPreferences(
    @Req() req: Request,
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<FormattedIdpSettingDto | HttpErrorResponse> {
    /**
     * @Todo find better way to define interface
     * Author: Emmanuel Maravilha
     */
    const idpIdentity = (await sessionOidc.get(
      'idpIdentity',
    )) as OidcIdentityInterface;
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const { DISPLAYED_USER_PREFERENCES } = this.tracking.TrackedEventsMap;
    const context: TrackedEventContextInterface = {
      req,
      identity: idpIdentity,
    };
    await this.tracking.track(DISPLAYED_USER_PREFERENCES, context);
    // idp_id has been removed because it is not necessary to pass it to the consumer
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { idp_id: _idpId, ...identityFiltered } = idpIdentity;

    const preferences = await this.userPreferences.getUserPreferencesList(
      identityFiltered,
    );

    return res.json(preferences);
  }

  @Post(UserDashboardBackRoutes.USER_PREFERENCES)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  // eslint-disable-next-line complexity
  async updateUserPreferences(
    @Req() req: Request,
    @Res() res,
    @Body() body: UserPreferencesBodyDto,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<FormattedIdpSettingDto | HttpErrorResponse> {
    /**
     * @Todo find better way to define interface
     * Author: Emmanuel Maravilha
     */
    const idpIdentity = (await sessionOidc.get(
      'idpIdentity',
    )) as OidcIdentityInterface;
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const { csrfToken, idpList, allowFutureIdp } = body;

    const {
      email,
      given_name: givenName,
      family_name: familyName,
      idp_id: lastUsedIdpId,
    } = idpIdentity;

    const containsSelectedIdp = idpList.includes(lastUsedIdpId);
    if (!containsSelectedIdp) {
      return res.status(HttpStatus.CONFLICT).send({
        code: 'CONFLICT',
      });
    }

    // -- control if the CSRF provided is the same as the one previously saved in session.
    try {
      await this.csrfService.validate(sessionOidc, csrfToken);
    } catch (error) {
      this.logger.trace({ error });

      throw new SessionInvalidCsrfSelectIdpException(error);
    }

    // idp_id has been removed because it is not necessary to pass it to the consumer
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { idp_id: _idpId, ...identityFiltered } = idpIdentity;

    const preferences = await this.userPreferences.setUserPreferencesList(
      identityFiltered,
      { idpList, allowFutureIdp },
    );

    await this.trackUserPreferenceChange(req, preferences, idpIdentity);

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

    return res.json(preferences);
  }

  private async trackUserPreferenceChange(
    req: Request,
    formattedIdpSetting: FormattedIdpSettingDto,
    identity: IOidcIdentity | PartialExcept<IOidcIdentity, 'sub'>,
  ) {
    const { hasAllowFutureIdpChanged } = formattedIdpSetting;
    const { futureAllowedNewValue, list } =
      this.userDashboard.formatUserPreferenceChangeTrackLog(
        formattedIdpSetting,
      );

    // Common id for all events in this changeset
    const changeSetId = uuid();

    const {
      UPDATED_USER_PREFERENCES,
      UPDATED_USER_PREFERENCES_FUTURE_IDP,
      UPDATED_USER_PREFERENCES_IDP,
    } = this.tracking.TrackedEventsMap;

    // Global change tracking
    await this.tracking.track(UPDATED_USER_PREFERENCES, {
      req,
      changeSetId,
      hasAllowFutureIdpChanged,
      idpLength: list.length,
      identity,
    });

    // Futures Idp changes tracking
    if (hasAllowFutureIdpChanged) {
      await this.tracking.track(UPDATED_USER_PREFERENCES_FUTURE_IDP, {
        req,
        identity,
        futureAllowedNewValue,
        changeSetId,
      });
    }

    // Individual Idp changes tracking
    list.forEach(async (idpChanges) => {
      await this.tracking.track(UPDATED_USER_PREFERENCES_IDP, {
        req,
        idpChanges,
        identity,
        changeSetId,
      });
    });
  }
}
