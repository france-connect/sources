import { Injectable } from '@nestjs/common';

import { SessionService } from '@fc/session';

@Injectable()
export class FlowStepsService {
  constructor(private readonly session: SessionService) {}

  setStep(stepRoute: string): void {
    this.session.set('OidcClient', 'stepRoute', stepRoute);
  }
}
