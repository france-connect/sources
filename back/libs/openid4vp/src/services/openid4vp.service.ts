import { Observable } from 'rxjs';

import { Injectable } from '@nestjs/common';

import { nowInSeconds } from '@fc/common';
import { MdocDocumentInterface, SimpleDocumentInterface } from '@fc/mdoc';

import { Openid4vpInteractionDto, Openid4vpRequestConfig } from '../dto';
import {
  Openid4vpAuthorizationError,
  Openid4vpFlow,
  Openid4vpInteractionStatus,
} from '../enums';
import { Openid4vpAuthorizationNotFoundException } from '../exceptions';
import {
  AuthorizationRequestObjectInterface,
  AuthorizationRequestPayload,
} from '../interfaces';
import { Openid4vpInteractionStatusService } from './openid4vp-interaction-status.service';
import { Openid4vpRequestService } from './openid4vp-request.service';
import { Openid4vpResponseService } from './openid4vp-response.service';
import { Openid4vpSessionService } from './openid4vp-session.service';

@Injectable()
export class Openid4vpService {
  constructor(
    private readonly request: Openid4vpRequestService,
    private readonly session: Openid4vpSessionService,
    private readonly response: Openid4vpResponseService,
    private readonly interactionStatus: Openid4vpInteractionStatusService,
  ) {}

  async createAuthorizationRequest(
    id: string,
    options: Openid4vpRequestConfig,
  ): Promise<string> {
    const params = this.request.generateInteractionParams(
      id,
      options.credentialQueryId,
    );

    this.session.bindRequestToSession(params.id);

    await this.session.saveInteraction(params);

    return params.id;
  }

  getRequestById(
    credentialQueryId: string,
  ): Openid4vpRequestConfig | undefined {
    return this.request.getRequestById(credentialQueryId);
  }

  getAuthorizeRequestUri(
    interaction: Openid4vpInteractionDto,
    flow: Openid4vpFlow,
  ): string {
    return this.request.getAuthorizeRequestUri(interaction, flow);
  }

  async getRequestObject(
    interaction: Openid4vpInteractionDto,
    flow: Openid4vpFlow,
  ): Promise<AuthorizationRequestObjectInterface> {
    const request = this.getRequestById(interaction.credentialQueryId);

    return await this.request.createAuthorizeRequestObject(
      interaction,
      request,
      flow,
    );
  }

  async setAuthorizationRequestObjectAsRead(
    interaction: Openid4vpInteractionDto,
    flow: Openid4vpFlow,
  ): Promise<void> {
    return await this.session.setAuthorizationRequestObjectAsRead(
      interaction,
      flow,
    );
  }

  async getInteractionById(id: string): Promise<Openid4vpInteractionDto> {
    const interaction = await this.session.getInteractionById(id);

    this.checkInteraction(interaction);

    return interaction;
  }

  getFlow(interaction: Openid4vpInteractionDto, state: string): Openid4vpFlow {
    return state === interaction.state.sameDevice
      ? Openid4vpFlow.SAME_DEVICE
      : Openid4vpFlow.CROSS_DEVICE;
  }

  async bindInteractionToBackendId(
    backendId: string,
    interaction: Openid4vpInteractionDto,
  ): Promise<string> {
    return await this.session.bindInteractionToBackendId(
      backendId,
      interaction,
    );
  }

  async unbindInteractionFromBackendId(backendId: string): Promise<void> {
    return await this.session.unbindInteractionFromBackendId(backendId);
  }

  async getInteractionByBackendId(
    backendId: string,
  ): Promise<Openid4vpInteractionDto> {
    const interaction = await this.session.getInteractionByBackendId(backendId);

    this.checkInteraction(interaction);

    return interaction;
  }

  async getUserInteractionById(id: string): Promise<Openid4vpInteractionDto> {
    const interactions = this.session.getSessionAuthorizationRequests();

    if (!interactions.includes(id)) {
      throw new Openid4vpAuthorizationNotFoundException();
    }

    return await this.getInteractionById(id);
  }

  async parseResponse(
    response: Record<string, unknown>,
    interaction: Openid4vpInteractionDto,
    flow: Openid4vpFlow,
  ): Promise<MdocDocumentInterface[]> {
    const requestObject = await this.getRequestObject(interaction, flow);

    const parsed = await this.response.parseAuthorizationResponse(
      response,
      requestObject.authorizationRequestPayload as AuthorizationRequestPayload,
      interaction.credentialQueryId,
    );

    return parsed;
  }

  async saveResponse(
    interaction: Openid4vpInteractionDto,
    response: SimpleDocumentInterface<unknown>[],
  ): Promise<void> {
    return await this.session.saveResponse(interaction, response);
  }

  async saveError(
    interaction: Openid4vpInteractionDto,
    error: Openid4vpAuthorizationError,
    errorDescription: string,
  ): Promise<void> {
    return await this.session.saveError(interaction, error, errorDescription);
  }

  subscribeToStatusChanges(
    interactionId: string,
  ): Observable<Openid4vpInteractionStatus> {
    return this.interactionStatus.subscribeToStatusChanges(interactionId);
  }

  private checkInteraction(interaction: Openid4vpInteractionDto): void {
    const exp = interaction?.exp || 0;
    const now = nowInSeconds();

    if (exp < now) {
      throw new Openid4vpAuthorizationNotFoundException();
    }
  }
}
