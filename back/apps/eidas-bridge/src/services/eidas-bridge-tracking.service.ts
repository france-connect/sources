import { Injectable } from '@nestjs/common';

import { EidasClientSession } from '@fc/eidas-client';
import { EidasProviderSession } from '@fc/eidas-provider';
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
  async buildLog(
    trackedEvent: EidasBridgeTrackedEventInterface,
    ctx: TrackedEventContextInterface,
  ): Promise<EidasBridgeTrackingLogInterface> {
    const { step, event, category, countryCodeSrc, countryCodeDst } =
      trackedEvent;

    const context = await this.extractContext(trackedEvent, ctx);

    return {
      event,
      category,
      step,
      countryCodeSrc,
      countryCodeDst,
      ...context,
    };
  }

  private async extractContext(
    trackedEvent: EidasBridgeTrackedEventInterface,
    ctx: TrackedEventContextInterface,
  ) {
    const { category } = trackedEvent;
    const { req } = ctx;
    const { sessionId } = req;

    const source = extractNetworkInfoFromHeaders(ctx);

    const baseContext: any = {
      source,
      sessionId,
    };

    let requestContext = {};

    switch (category) {
      case EventsCategoriesEnum.EU_REQUEST:
        requestContext = await this.extractContextFromEuRequest(ctx);
        break;
      case EventsCategoriesEnum.FR_REQUEST:
        requestContext = await this.extractContextFromFrRequest(ctx);
        break;
    }

    const context = { ...baseContext, ...requestContext };

    return context;
  }

  private async extractContextFromEuRequest(ctx: TrackedEventContextInterface) {
    const { req } = ctx;

    const sessionOidc = await SessionService.getBoundSession<OidcClientSession>(
      req,
      'OidcClient',
    ).get();

    const sessionEidas =
      await SessionService.getBoundSession<EidasProviderSession>(
        req,
        'EidasProvider',
      ).get();

    const context = {
      eidasLevelRequested: sessionEidas?.eidasRequest?.levelOfAssurance,
      countryCodeSrc: sessionEidas?.eidasRequest?.spCountryCode,
      eidasLevelReceived: sessionEidas?.partialEidasResponse?.levelOfAssurance,
      idpSub: sessionOidc?.idpIdentity?.sub,
      spSub: sessionEidas?.partialEidasResponse?.subject,
    };

    return context;
  }

  private async extractContextFromFrRequest(ctx: TrackedEventContextInterface) {
    const { req, countryCodeDst } = ctx;

    const sessionOidc = await SessionService.getBoundSession<OidcClientSession>(
      req,
      'OidcClient',
    ).get();

    const sessionEidas =
      await SessionService.getBoundSession<EidasClientSession>(
        req,
        'EidasClient',
      ).get();

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
