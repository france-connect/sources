import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { IPaginationOptions } from '@fc/common';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { TracksProtocol } from '@fc/microservices';
import { TracksResults } from '@fc/tracks';

import {
  CsmrTracksAccountService,
  CsmrTracksElasticService,
  CsmrTracksFormatterService,
} from '../services';

@Controller()
export class CsmrTracksController {
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly cryptographyFcp: CryptographyFcpService,
    private readonly account: CsmrTracksAccountService,
    private readonly elastic: CsmrTracksElasticService,
    private readonly tracks: CsmrTracksFormatterService,
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
   * @returns {Promise<FSA<IPaginationResult, ICsmrTracksOutputTrack[]> | 'ERROR'>}
   */
  @MessagePattern(TracksProtocol.Commands.GET)
  async aggregateTracks(
    /**
     * @todo add Dto validation and typing
     *
     * Author: Hugues Charleux & Arnaud PSA
     * Date: 20/06/22
     */
    @Payload() payload,
  ): Promise<TracksResults | 'ERROR'> {
    this.logger.debug(
      `New message received with pattern "${TracksProtocol.Commands.GET}"`,
    );

    this.logger.trace({ payload });

    const { identity, options } = payload;
    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);

    this.logger.trace({ identityHash });

    try {
      const groupIds = await this.account.getIdsWithIdentityHash(identityHash);

      if (!groupIds.length) {
        this.logger.debug('No AccountId found');

        const { size, offset } = options as IPaginationOptions;
        const results: TracksResults = {
          meta: {
            total: 0,
            size,
            offset,
          },
          payload: [],
        };
        return results;
      }

      const { meta, payload: raw } = await this.elastic.getTracks(
        groupIds,
        options as IPaginationOptions,
      );

      const payload = this.tracks.formatTracks(raw);

      const results: TracksResults = { meta, payload };

      return results;
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      /**
       * @todo #825 implement Error protocol
       *
       * Author: Arnaud PSA
       * Date: 22/02/2022
       */

      return 'ERROR';
    }
  }
}
