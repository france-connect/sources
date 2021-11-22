import { ValidatorOptions } from 'class-validator';
import { TokenSet } from 'openid-client';

import { Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity } from '@fc/oidc';
import { IEventContext, TrackingService } from '@fc/tracking';

import { MinIdentityDto, TokenResultDto } from '../dto';
import { OidcClientTokenEvent, OidcClientUserinfoEvent } from '../events';
import { OidcClientUserinfosFailedException } from '../exceptions';
import {
  ExtraTokenParams,
  TokenParams,
  TokenResults,
  UserInfosParams,
} from '../interfaces';
import { OidcClientUtilsService } from './oidc-client-utils.service';

const DTO_OPTIONS: ValidatorOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
};

@Injectable()
export class OidcClientService {
  constructor(
    private readonly logger: LoggerService,
    private readonly tracking: TrackingService,
    public readonly utils: OidcClientUtilsService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getTokenFromProvider(
    idpId: string,
    params: TokenParams,
    context: IEventContext,
    extraParams?: ExtraTokenParams,
  ): Promise<TokenResults> {
    /**
     * @todo #434 refacto sur getTokenSet,
     * - ne pas renvoyer tokenSet mais directement tokenResult
     * - inclure le DTO à la fin de getTokenSet (seul vérification de l'acces_token)
     * - simplifier les appels de getTokenSet en (idp, les code de transfert(state, nonce), le context pour tracking)
     * - voir commit original : 440d0a1734e0e1206b7e21781cbb0f186a93dd82
     */
    // OIDC: call idp's /token endpoint
    const tokenSet: TokenSet = await this.utils.getTokenSet(
      context,
      idpId,
      params,
      extraParams,
    );

    this.tracking.track(OidcClientTokenEvent, context);

    const { access_token: accessToken, id_token: idToken } = tokenSet;
    const { acr, amr } = tokenSet.claims();

    const tokenResult = {
      acr,
      amr,
      accessToken,
      idToken,
    };

    const errorsOutputs = await validateDto(
      tokenResult,
      TokenResultDto,
      DTO_OPTIONS,
    );

    if (errorsOutputs.length) {
      throw new Error(
        `"${JSON.stringify(
          tokenResult,
        )}" input was wrong from the result at DTO validation: ${JSON.stringify(
          errorsOutputs,
        )}`,
      );
    }

    this.logger.trace({
      search: {
        context,
        idpId,
        params,
        acr,
        amr,
        accessToken,
        tokenResult,
        idToken,
      },
    });

    return tokenResult;
  }

  async getUserInfosFromProvider(
    { accessToken, idpId }: UserInfosParams,
    context: IEventContext,
  ): Promise<IOidcIdentity> {
    // OIDC: call idp's /userinfo endpoint
    let identity: IOidcIdentity;
    try {
      identity = await this.utils.getUserInfo(accessToken, idpId);
    } catch (error) {
      this.logger.error(error, 'getUserInfo');
      /**
       * @todo Add the error to the exception, then add "@Loggable()" decorator
       * to the exception.
       *
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/merge_requests/494#note_102947
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/587
       */
      throw new OidcClientUserinfosFailedException();
    }

    this.logger.trace({
      search: {
        context,
        idpId,
        accessToken,
        identity,
      },
    });

    this.tracking.track(OidcClientUserinfoEvent, context);

    const errors = await validateDto(
      identity,
      MinIdentityDto,
      {
        whitelist: true,
      },
      {
        excludeExtraneousValues: true,
      },
    );

    if (errors.length) {
      throw new Error(
        `"${idpId}" doesn't provide a minimum identity information: ${JSON.stringify(
          errors,
        )}`,
      );
    }

    return identity;
  }

  async getEndSessionUrlFromProvider(
    ipdId: string,
    stateFromSession: string,
    idTokenHint?: TokenSet | string,
    postLogoutRedirectUri?: string,
  ) {
    return this.utils.getEndSessionUrl(
      ipdId,
      stateFromSession,
      idTokenHint,
      postLogoutRedirectUri,
    );
  }
}
