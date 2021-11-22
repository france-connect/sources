import {
  Controller,
  Get,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService, Session, SessionCsrfService } from '@fc/session';

import { TracksService } from '../services/tracks.service';
import { UserDashboardBackRoutes } from './../enums';

@Injectable()
@Controller()
export class UserDashboardController {
  constructor(
    private readonly logger: LoggerService,
    private readonly csrfService: SessionCsrfService,
    private readonly tracks: TracksService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(UserDashboardBackRoutes.CSRF_TOKEN)
  async getCsrfToken(
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<{ csrfToken: string }> {
    const csrfToken = this.csrfService.get();
    await this.csrfService.save(sessionOidc, csrfToken);

    return { csrfToken };
  }

  @Get(UserDashboardBackRoutes.TRACKS)
  async getUserTraces(
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<unknown> {
    const session = await sessionOidc.get();
    if (!session) {
      throw new UnauthorizedException();
    }
    const { idpIdentity } = session;
    const tracks = await this.tracks.getList(idpIdentity);
    return tracks;
  }

  @Get(UserDashboardBackRoutes.USER_INFOS)
  async getUserInfos(
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<{ userInfos: { givenName: string; familyName: string } }> {
    const session = await sessionOidc.get();
    if (!session) {
      throw new UnauthorizedException();
    }
    const { idpIdentity } = session;
    const userInfos = {
      familyName: idpIdentity?.family_name,
      givenName: idpIdentity?.given_name,
    };
    return { userInfos };
  }
}
