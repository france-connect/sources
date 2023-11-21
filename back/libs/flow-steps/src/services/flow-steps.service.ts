import { Injectable } from '@nestjs/common';

import { OidcSession } from '@fc/oidc';
import { ISessionRequest, SessionService } from '@fc/session';

@Injectable()
export class FlowStepsService {
  async setStep(req: ISessionRequest, stepRoute: string): Promise<void> {
    const session = SessionService.getBoundSession<OidcSession>(
      req,
      'OidcClient',
    );

    await session.set('stepRoute', stepRoute);
  }
}
