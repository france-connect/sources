import { Injectable } from '@nestjs/common';

import { nowInSeconds } from '@fc/common';
import { MdocDocumentInterface, SimpleDocumentInterface } from '@fc/mdoc';

import { Openid4vpInteractionDto, Openid4vpRequestConfig } from '../dto';
import { Openid4vpAuthorizationNotFoundException } from '../exceptions';
import {
  AuthorizationRequestObjectInterface,
  AuthorizationRequestPayload,
} from '../interfaces';
import { Openid4vpRequestService } from './openid4vp-request.service';
import { Openid4vpResponseService } from './openid4vp-response.service';
import { Openid4vpSessionService } from './openid4vp-session.service';

@Injectable()
export class Openid4vpService {
  constructor(
    private readonly request: Openid4vpRequestService,
    private readonly session: Openid4vpSessionService,
    private readonly response: Openid4vpResponseService,
  ) {}

  async createAuthorizationRequest(
    options: Openid4vpRequestConfig,
  ): Promise<string> {
    const params = this.request.generateInteractionParams(
      options.presentationId,
    );

    this.session.bindRequestToSession(params.id);

    await this.session.saveInteraction(params);

    return params.id;
  }

  getRequestById(presentationId: string): Openid4vpRequestConfig | undefined {
    return this.request.getRequestById(presentationId);
  }

  getAuthorizeRequestUri(interaction: Openid4vpInteractionDto) {
    const uri = this.request.getAuthorizeRequestUri(interaction);

    return uri;
  }

  async getRequestObject(
    interaction: Openid4vpInteractionDto,
  ): Promise<AuthorizationRequestObjectInterface> {
    const request = this.getRequestById(interaction.presentationId);

    return await this.request.createAuthorizeRequestObject(
      interaction,
      request,
    );
  }

  async setAuthorizationRequestObjectAsRead(
    interaction: Openid4vpInteractionDto,
  ): Promise<void> {
    return await this.session.setAuthorizationRequestObjectAsRead(interaction);
  }

  async getInteractionById(id: string): Promise<Openid4vpInteractionDto> {
    const interaction = await this.session.getInteractionById(id);

    this.checkInteraction(interaction);

    return interaction;
  }

  async getInteractionByState(state: string): Promise<Openid4vpInteractionDto> {
    const interaction = await this.session.getInteractionByState(state);

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
  ): Promise<MdocDocumentInterface[]> {
    const requestObject = await this.getRequestObject(interaction);

    const parsed = await this.response.parseAuthorizationResponse(
      response,
      requestObject.authorizationRequestPayload as AuthorizationRequestPayload,
    );

    return parsed;
  }

  async saveResponse(
    interaction: Openid4vpInteractionDto,
    response: SimpleDocumentInterface<unknown>[],
  ): Promise<void> {
    return await this.session.saveResponse(interaction, response);
  }

  private checkInteraction(interaction: Openid4vpInteractionDto): void {
    const exp = interaction?.exp || 0;
    const now = nowInSeconds();

    if (exp < now) {
      throw new Openid4vpAuthorizationNotFoundException();
    }
  }
}
