import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { SimpleDocumentInterface } from '@fc/mdoc';
import { RedisService } from '@fc/redis';
import { SessionService } from '@fc/session';

import {
  Openid4vpConfig,
  Openid4vpInteractionDto,
  Openid4vpSessionDto,
} from '../dto';
import {
  Openid4vpAuthorizationError,
  Openid4vpInteractionStatus,
} from '../enums';
import { Openid4vpAuthorizationNotFoundException } from '../exceptions';
import { CONFIG_NAMESPACE, SESSION_NAMESPACE } from '../tokens';
import { Openid4vpInteractionStatusService } from './openid4vp-interaction-status.service';

@Injectable()
export class Openid4vpSessionService {
  // allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    private readonly session: SessionService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly interactionStatus: Openid4vpInteractionStatusService,
  ) {}

  bindRequestToSession(requestId: string): void {
    const interactions = this.getSessionAuthorizationRequests();

    interactions.push(requestId);

    this.session.set(SESSION_NAMESPACE, { interactions });
  }

  getSessionAuthorizationRequests(): string[] {
    const session = this.session.get<Openid4vpSessionDto>(SESSION_NAMESPACE);

    if (!session) {
      return [];
    }

    return session.interactions;
  }

  async saveInteraction(interaction: Openid4vpInteractionDto): Promise<void> {
    const redisKey = this.getInteractionRedisKey(interaction.id);

    const {
      relayingParty: { interactionTtl },
    } = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const multi = this.redis.client.multi();

    /** @todo #2630 serialization and encryption */
    multi.set(redisKey, JSON.stringify(interaction));
    multi.expire(redisKey, interactionTtl);

    this.logger.debug('redis.multi.exec');

    await multi.exec();
  }

  async setAuthorizationRequestObjectAsRead(
    interaction: Openid4vpInteractionDto,
  ): Promise<void> {
    const idKey = this.getInteractionRedisKey(interaction.id);
    const stateKey = this.getStateRedisKey(interaction.state);

    const {
      relayingParty: { responseDelay },
    } = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const multi = this.redis.client.multi();

    multi.set(
      idKey,
      /** @todo #2630 serialization and encryption */
      JSON.stringify({
        ...interaction,
        status: Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
      }),
    );
    multi.expire(idKey, responseDelay);

    multi.set(stateKey, interaction.id);
    multi.expire(stateKey, responseDelay);

    this.logger.debug('redis.multi.exec');

    await multi.exec();

    await this.interactionStatus.publishStatus(
      interaction.id,
      Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
    );
  }

  async bindInteractionToBackendId(
    backendId: string,
    interaction: Openid4vpInteractionDto,
  ): Promise<string> {
    const {
      relayingParty: { responseDelay },
    } = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const key = this.getBackendIdRedisKey(backendId);
    const multi = this.redis.client.multi();
    multi.set(key, interaction.id);
    multi.expire(key, responseDelay);

    await multi.exec();

    return backendId;
  }

  async unbindInteractionFromBackendId(backendId: string): Promise<void> {
    const key = this.getBackendIdRedisKey(backendId);
    await this.redis.client.del(key);
  }

  async getInteractionByBackendId(
    backendId: string,
  ): Promise<Openid4vpInteractionDto | undefined> {
    const key = this.getBackendIdRedisKey(backendId);

    const interactionId = await this.redis.client.get(key);

    if (!interactionId) {
      throw new Openid4vpAuthorizationNotFoundException();
    }

    return await this.getInteractionById(interactionId);
  }

  async getInteractionByState(
    state: string,
  ): Promise<Openid4vpInteractionDto | undefined> {
    const stateKey = this.getStateRedisKey(state);

    const interactionId = await this.redis.client.get(stateKey);

    if (!interactionId) {
      throw new Openid4vpAuthorizationNotFoundException();
    }

    return await this.getInteractionById(interactionId);
  }

  async getInteractionById(
    interactionId: string,
  ): Promise<Openid4vpInteractionDto | undefined> {
    const redisKey = this.getInteractionRedisKey(interactionId);
    const interaction = await this.redis.client.get(redisKey);

    /**
     * @todo validate DTO + transform + throw
     * @todo #2630 serialization and encryption
     */
    return JSON.parse(interaction);
  }

  async saveResponse(
    interaction: Openid4vpInteractionDto,
    response: SimpleDocumentInterface<unknown>[],
  ): Promise<void> {
    const updatedInteraction: Openid4vpInteractionDto = {
      ...interaction,
      response,
      status: Openid4vpInteractionStatus.RESPONSE_RECEIVED,
    };

    await this.persistTerminalState(updatedInteraction);
  }

  async saveError(
    interaction: Openid4vpInteractionDto,
    error: Openid4vpAuthorizationError,
    errorDescription: string,
  ): Promise<void> {
    const updatedInteraction: Openid4vpInteractionDto = {
      ...interaction,
      error,
      errorDescription,
      status: Openid4vpInteractionStatus.ERROR,
    };

    await this.persistTerminalState(updatedInteraction);
  }

  private async persistTerminalState(
    interaction: Openid4vpInteractionDto,
  ): Promise<void> {
    const stateKey = this.getStateRedisKey(interaction.state);
    const idKey = this.getInteractionRedisKey(interaction.id);

    const {
      relayingParty: { interactionTtl },
    } = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const multi = this.redis.client.multi();

    /** @todo #2630 serialization and encryption */
    multi.set(idKey, JSON.stringify(interaction));
    multi.expire(idKey, interactionTtl);
    multi.del(stateKey);

    this.logger.debug('redis.multi.exec');

    await multi.exec();

    await this.interactionStatus.publishStatus(
      interaction.id,
      interaction.status,
    );
  }

  private getInteractionRedisKey(requestId: string): string {
    return `oid4vp:req:${requestId}`;
  }

  private getStateRedisKey(state: string): string {
    return `oid4vp:state:${state}`;
  }

  private getBackendIdRedisKey(backendId: string): string {
    return `oid4vp:backend:${backendId}`;
  }
}
