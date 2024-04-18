import { Injectable } from '@nestjs/common';

import { EidasClientSession } from '@fc/eidas-client';
import { EidasProviderSession } from '@fc/eidas-provider';
import { OidcSession } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { SessionService } from '@fc/session';
import {
  AppTrackingServiceAbstract,
  TrackedEventContextInterface,
} from '@fc/tracking';
import { extractNetworkInfoFromHeaders } from '@fc/tracking-context';

import { EventsCategoriesEnum } from '../enums';
import {
  EidasBridgeTrackedEventInterface,
  EidasBridgeTrackingLogInterface,
} from '../interfaces';

@Injectable()
export class EidasBridgeTrackingService implements AppTrackingServiceAbstract {
  constructor(private readonly session: SessionService) {}

  buildLog(
    trackedEvent: EidasBridgeTrackedEventInterface,
    ctx: TrackedEventContextInterface,
  ): Promise<EidasBridgeTrackingLogInterface> {
    const { step, event, category, countryCodeSrc, countryCodeDst } =
      trackedEvent;

    const context = this.extractContext(trackedEvent, ctx);

    return {
      event,
      category,
      step,
      countryCodeSrc,
      countryCodeDst,
      ...context,
    };
  }

  private extractContext(
    trackedEvent: EidasBridgeTrackedEventInterface,
    ctx: TrackedEventContextInterface,
  ) {
    const { category } = trackedEvent;
    const sessionId = this.session.getId();

    const source = extractNetworkInfoFromHeaders(ctx);

    const baseContext: any = {
      source,
      sessionId,
    };

    let requestContext = {};

    switch (category) {
      case EventsCategoriesEnum.EU_REQUEST:
        requestContext = this.extractContextFromEuRequest();
        break;
      case EventsCategoriesEnum.FR_REQUEST:
        requestContext = this.extractContextFromFrRequest(ctx);
        break;
    }

    const context = { ...baseContext, ...requestContext };

    return context;
  }

  private extractContextFromEuRequest() {
    const sessionOidc = this.session.get<OidcSession>('OidcClient');
    const sessionEidas =
      this.session.get<EidasProviderSession>('EidasProvider');

    const context = {
      eidasLevelRequested: sessionEidas?.eidasRequest?.levelOfAssurance,
      countryCodeSrc: sessionEidas?.eidasRequest?.spCountryCode,
      eidasLevelReceived: sessionEidas?.partialEidasResponse?.levelOfAssurance,
      idpSub: sessionOidc?.idpIdentity?.sub,
      spSub: sessionEidas?.partialEidasResponse?.subject,
    };

    return context;
  }

  private extractContextFromFrRequest(ctx: TrackedEventContextInterface) {
    const { countryCodeDst } = ctx;

    const sessionOidc = this.session.get<OidcClientSession>('OidcClient');
    const sessionEidas = this.session.get<EidasClientSession>('EidasClient');

    const { idpIdentity, spId, subs } = sessionOidc || {};

    const context = {
      eidasLevelRequested: sessionEidas?.eidasPartialRequest?.levelOfAssurance,
      eidasLevelReceived: sessionEidas?.eidasResponse?.levelOfAssurance,
      countryCodeDst:
        sessionEidas?.eidasRequest?.citizenCountryCode || countryCodeDst,
      idpSub: idpIdentity?.sub,
      spSub: subs && subs[spId],
    };

    return context;
  }
}
