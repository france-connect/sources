import { Injectable } from '@nestjs/common';

import { Openid4vpAuthorizationError } from '@fc/openid4vp/enums';
import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';

import { SubmitBodyDto, SubmitErrorBodyDto } from '../dto';
import { Flows, MockWalletRoutes } from '../enums';
import {
  ConsentViewModel,
  ErrorPostBodyInterface,
  IdentitySelectViewModel,
  SubmitResult,
} from '../interfaces';
import { IdentityService } from './identity.service';
import { PresentationService } from './presentation.service';
import { RequestObjectService } from './request-object.service';
import { WalletResponseService } from './wallet-response.service';

const AUTHORIZATION_ERROR_DESCRIPTION = 'User cancelled the authentication';

@Injectable()
export class MockWalletFlowService {
  constructor(
    private readonly requestObject: RequestObjectService,
    private readonly identity: IdentityService,
    private readonly presentation: PresentationService,
    private readonly response: WalletResponseService,
  ) {}

  selectIdentity(
    deepLink: Openid4vpDeepLinkInterface,
    flow: Flows,
  ): IdentitySelectViewModel {
    const identities = this.identity.getIdentities().map((identity, index) => ({
      index,
      docType: identity.docType,
      attributes: identity.attributes,
    }));

    return {
      url: deepLink.toString(),
      flow,
      authorizeUrl: MockWalletRoutes.WALLET_AUTHORIZE,
      identities,
    };
  }

  async authorize(
    deepLink: Openid4vpDeepLinkInterface,
    flow: Flows,
    identityIndex: number,
  ): Promise<ConsentViewModel> {
    const jwt = await this.requestObject.fetch(deepLink.requestUri);
    const request = await this.requestObject.validate(jwt, deepLink);

    const identity = this.identity.getIdentity(identityIndex);

    const requestedClaims = this.presentation.extractRequestedClaims(
      request.presentation_definition,
    );
    const availableClaims = this.presentation.selectClaims(
      requestedClaims,
      identity,
    );

    const responsePayload = await this.presentation.buildResponsePayload(
      request,
      deepLink,
      identity,
    );

    return {
      availableClaims: Object.keys(availableClaims),
      responseUri: request.response_uri,
      responsePreview: JSON.stringify(responsePayload, null, 2),
      requestPayload: JSON.stringify(request, null, 2),
      responsePayload: JSON.stringify(responsePayload, null, 2),
      presentationDefinition: JSON.stringify(
        request.presentation_definition,
        null,
        2,
      ),
      submitUrl: MockWalletRoutes.WALLET_SUBMIT,
      submitErrorUrl: MockWalletRoutes.WALLET_SUBMIT_ERROR,
      flow,
    };
  }

  async submit(body: SubmitBodyDto): Promise<SubmitResult> {
    const request = await this.requestObject.validatePayload(
      body.requestPayload,
    );

    const postBody = await this.response.buildPostBody(
      body.responsePayload,
      request,
    );

    return await this.response.post(body.responseUri, postBody);
  }

  async authorizeError(
    deepLink: Openid4vpDeepLinkInterface,
    error?: Openid4vpAuthorizationError,
    errorDescription?: string,
  ): Promise<SubmitResult> {
    const jwt = await this.requestObject.fetch(deepLink.requestUri);
    const request = await this.requestObject.validate(jwt, deepLink);

    return await this.response.post(
      request.response_uri,
      this.buildErrorPostBody(request.state, error, errorDescription),
    );
  }

  async submitError(body: SubmitErrorBodyDto): Promise<SubmitResult> {
    const request = await this.requestObject.validatePayload(
      body.requestPayload,
    );

    return await this.response.post(
      body.responseUri,
      this.buildErrorPostBody(request.state),
    );
  }

  private buildErrorPostBody(
    state?: string,
    error: Openid4vpAuthorizationError = Openid4vpAuthorizationError.ACCESS_DENIED,
    errorDescription: string = AUTHORIZATION_ERROR_DESCRIPTION,
  ): ErrorPostBodyInterface {
    const stateParam = state ? { state } : {};

    return {
      ...stateParam,
      error,
      error_description: errorDescription,
    };
  }
}
