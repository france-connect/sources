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
import { Openid4vpInteractionStatus } from '../enums';
import { Openid4vpAuthorizationNotFoundException } from '../exceptions';
import { CONFIG_NAMESPACE, SESSION_NAMESPACE } from '../tokens';

@Injectable()
export class Openid4vpSessionService {
  constructor(
    private readonly session: SessionService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
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
    const stateKey = this.getStateRedisKey(interaction.state);
    const idKey = this.getInteractionRedisKey(interaction.id);

    const {
      relayingParty: { interactionTtl },
    } = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    const multi = this.redis.client.multi();

    /** @todo #2630 serialization and encryption */
    multi.set(idKey, JSON.stringify(updatedInteraction));
    multi.expire(idKey, interactionTtl);
    multi.del(stateKey);

    this.logger.debug('redis.multi.exec');

    await multi.exec();
  }

  private getInteractionRedisKey(requestId: string): string {
    return `oid4vp:req:${requestId}`;
  }

  private getStateRedisKey(state: string): string {
    return `oid4vp:state:${state}`;
  }
}
