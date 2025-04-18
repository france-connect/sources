import { ClassTransformOptions } from 'class-transformer';
import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Injectable,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FSA, getTransformed, PartialExcept } from '@fc/common';
import { ActionTypes, CsmrFraudClientService } from '@fc/csmr-fraud-client';
import {
  CsmrTracksClientService,
  TracksOutputInterface,
  TracksResultsInterface,
} from '@fc/csmr-tracks-client';
import { CsrfToken, CsrfTokenGuard } from '@fc/csrf';
import { I18nService } from '@fc/i18n';
import { IOidcIdentity, PivotIdentityDto } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { RichClaimInterface } from '@fc/scopes';
import { ISessionService, Session } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';
import {
  FormattedIdpSettingDto,
  UserPreferencesService,
} from '@fc/user-preferences';

import {
  FraudFormValuesDto,
  GetUserTracesQueryDto,
  UserPreferencesBodyDto,
} from '../dto';
import { UserDashboardBackRoutes } from '../enums';
import {
  HttpErrorResponse,
  OidcIdentityInterface,
  UserInfosInterface,
} from '../interfaces';
import { UserDashboardService } from '../services';

const FILTERED_OPTIONS: ClassTransformOptions = {
  excludeExtraneousValues: true,
};

@Injectable()
@Controller()
export class UserDashboardController {
  // eslint-disable-next-line max-params
  constructor(
    @Inject('Fraud')
    private readonly fraud: CsmrFraudClientService,
    private readonly tracking: TrackingService,
    private readonly tracks: CsmrTracksClientService,
    private readonly userPreferences: UserPreferencesService,
    private readonly userDashboard: UserDashboardService,
    private readonly i18n: I18nService,
  ) {}

  @Get(UserDashboardBackRoutes.CSRF_TOKEN)
  getCsrfToken(@CsrfToken() csrfToken: string): { csrfToken: string } {
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
    const idpIdentity = sessionOidc.get('idpIdentity');
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

    const tracks = await this.tracks.getList(idpIdentity, query);

    const humanReadableTracks = this.addLabelsToTracks(tracks);

    return res.json({
      type: 'TRACKS_DATA',
      ...humanReadableTracks,
    });
  }

  private addLabelsToTracks(
    tracks: TracksResultsInterface,
  ): TracksResultsInterface {
    tracks.payload = tracks.payload.map(this.addLabelsToTrack.bind(this));
    return tracks;
  }

  private addLabelsToTrack(
    track: TracksOutputInterface,
  ): TracksOutputInterface {
    track.claims = track.claims
      .map((claim: RichClaimInterface) => {
        claim.label = this.i18n.translate(`claim.${claim.identifier}`);
        return claim;
      })
      .filter((claim: RichClaimInterface) => claim.label);

    return track;
  }

  @Get(UserDashboardBackRoutes.USER_INFOS)
  getUserInfos(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<UserInfosInterface | HttpErrorResponse> {
    const idpIdentity = sessionOidc.get('idpIdentity') as OidcIdentityInterface;
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const {
      given_name: firstname,
      family_name: lastname,
      idp_id: idpId,
      email,
    } = idpIdentity;

    const userInfos = {
      firstname,
      lastname,
      idpId,
      email,
    };

    return res.json(userInfos);
  }

  @Get(UserDashboardBackRoutes.USER_PREFERENCES)
  async getUserPreferences(
    @Req() req: Request,
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<FormattedIdpSettingDto | HttpErrorResponse> {
    const idpIdentity = sessionOidc.get('idpIdentity') as OidcIdentityInterface;
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

    const identityFiltered = getTransformed<PivotIdentityDto>(
      idpIdentity,
      PivotIdentityDto,
      FILTERED_OPTIONS,
    );

    const preferences =
      await this.userPreferences.getUserPreferencesList(identityFiltered);

    return res.json(preferences);
  }

  @Post(UserDashboardBackRoutes.USER_PREFERENCES)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(CsrfTokenGuard)
  async updateUserPreferences(
    @Req() req: Request,
    @Res() res,
    @Body() body: UserPreferencesBodyDto,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<FormattedIdpSettingDto | HttpErrorResponse> {
    const idpIdentity = sessionOidc.get('idpIdentity') as OidcIdentityInterface;
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const { idpList, allowFutureIdp } = body;

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

    const identityFiltered = getTransformed<PivotIdentityDto>(
      idpIdentity,
      PivotIdentityDto,
      FILTERED_OPTIONS,
    );

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

  @Post(UserDashboardBackRoutes.FRAUD_FORM)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(CsrfTokenGuard)
  async processFraudForm(
    @Res() res,
    @Req() req,
    @Body() body: FraudFormValuesDto,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<FormattedIdpSettingDto | HttpErrorResponse> {
    const idpIdentity = sessionOidc.get('idpIdentity') as OidcIdentityInterface;
    if (!idpIdentity) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        code: 'INVALID_SESSION',
      });
    }

    const identityFiltered = getTransformed<PivotIdentityDto>(
      idpIdentity,
      PivotIdentityDto,
      FILTERED_OPTIONS,
    );

    const fraudCaseId = uuid();

    const message = {
      type: ActionTypes.PROCESS_FRAUD_CASE,
      payload: {
        identity: identityFiltered,
        fraudCase: {
          fraudCaseId,
          ...body,
        },
      },
    };

    const { payload: fraudCaseTrackingData } =
      await this.fraud.publish(message);

    const { FRAUD_CASE_OPENED } = this.tracking.TrackedEventsMap;

    const context: TrackedEventContextInterface = {
      req,
      identity: idpIdentity,
      fraudCaseContext: {
        isAuthenticated: true,
        ...fraudCaseTrackingData,
      },
    };

    await this.tracking.track(FRAUD_CASE_OPENED, context);

    return res.status(HttpStatus.OK).send();
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
      identity,
      userPreferencesContext: {
        changeSetId,
        payload: {
          hasAllowFutureIdpChanged,
          idpLength: list.length,
        },
      },
    });

    // Futures Idp changes tracking
    if (hasAllowFutureIdpChanged) {
      await this.tracking.track(UPDATED_USER_PREFERENCES_FUTURE_IDP, {
        req,
        identity,
        userPreferencesContext: {
          changeSetId,
          payload: {
            futureAllowedNewValue,
          },
        },
      });
    }

    // Individual Idp changes tracking
    list.forEach(async (idpChanges) => {
      await this.tracking.track(UPDATED_USER_PREFERENCES_IDP, {
        req,
        identity,
        userPreferencesContext: {
          changeSetId,
          payload: {
            ...idpChanges,
          },
        },
      });
    });
  }
}
