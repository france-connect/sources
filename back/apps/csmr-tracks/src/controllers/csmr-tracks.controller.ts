import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { TracksProtocol } from '@fc/microservices';

import { ICsmrTracksOutputTrack } from '../interfaces';
import { CsmrTracksService } from '../services';

@Controller()
export class CsmrTracksController {
  constructor(
    private readonly logger: LoggerService,
    private readonly csmrTracks: CsmrTracksService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * The payload is received by RabbitMQ, the application is sync with RabbitMQ
   * for a specific 'topic', once a payload is received it will automatically fire
   * this controller's method.
   * The traces are stored in Elasicsearch, this method does the binding between the payload
   * account information and the anonymized traces stored in Elasticsearch to retrieve
   * the specific traces for a specific account.
   *
   * The Payload can be tested here: http://localhost:15673/#/queues/%2F/tracks
   *
   * @param payload Received under this format:
   * @example {
   *  given_name: "Angela Claire Louise",
   *   family_name: "DUBOIS",
   *   birthdate: "1962-08-24",
   *   gender: "female",
   *   preferred_username: "",
   *   birthcountry: "99100",
   *   birthplace: "75107",
   *   email: "wossewodda-3728@yopmail.com",
   *   phone_number: "123456789",
   *   address: {
   *     country: "France",
   *     formatted: "France Paris 75107 20 avenue de Ségur",
   *     locality: "Paris",
   *     postal_code: "75107",
   *     street_address: "20 avenue de Ségur"
   *   },
   * }
   * @returns {Promise<ICsmrTracksOutputTrack[]>}
   */
  @MessagePattern(TracksProtocol.Commands.GET)
  async getTracks(@Payload() payload): Promise<ICsmrTracksOutputTrack[]> {
    let tracks: ICsmrTracksOutputTrack[];

    this.logger.debug(
      `New message received with pattern "${TracksProtocol.Commands.GET}"`,
    );

    try {
      const { identity } = payload;
      tracks = await this.csmrTracks.getList(identity);
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      tracks = [];
    }

    this.logger.trace({
      input: { payload },
      name: 'TracksProtocol.Commands.GET',
      output: { tracks },
      patern: TracksProtocol.Commands.GET,
    });

    return tracks;
  }
}
