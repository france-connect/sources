import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { TracksProtocol } from '@fc/microservices';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import {
  CsmrAggregateTracksAggregationFailedException,
  CsmrAggregateTracksFormatTracksFailedException,
} from '../exceptions';
import {
  CmsrAggregateTracksBrokerService,
  CsmrAggregrateTracksFactoryService,
} from '../services';

@Controller()
export class CsmrAggregateTracksController {
  constructor(
    private readonly logger: LoggerService,
    private readonly cryptographyFcp: CryptographyFcpService,
    private readonly broker: CmsrAggregateTracksBrokerService,
    private readonly factory: CsmrAggregrateTracksFactoryService,
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
  async aggregateTracks(@Payload() payload): Promise<ICsmrTracksOutputTrack[]> {
    this.logger.debug(
      `New message received with pattern "${TracksProtocol.Commands.GET}"`,
    );

    this.logger.trace({ payload });

    const { identity } = payload;

    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);

    let tracksGroup: ICsmrTracksOutputTrack[][];
    try {
      tracksGroup = await this.broker.getTracksGroup(identityHash);
      this.logger.trace({ tracksGroup });
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new CsmrAggregateTracksAggregationFailedException(error);
      /**
       * @todo #825 return 'ERROR';
       * throw an UnhandledPromiseRejectionWarning: Error: Asked unknown configuration: <App>
       * should implement new CSMR error management
       *
       * Author: Arnaud PSA
       * Date: 11/03/22
       */
    }

    try {
      const tracks = this.factory.mergeGroups(tracksGroup);
      this.logger.trace({
        input: { payload },
        output: { tracks },
        pattern: TracksProtocol.Commands.GET,
      });
      return tracks;
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new CsmrAggregateTracksFormatTracksFailedException(error);
      /**
       * @todo #825 return 'ERROR';
       * throw an UnhandledPromiseRejectionWarning: Error: Asked unknown configuration: <App>
       * should implement new CSMR error management
       *
       * Author: Arnaud PSA
       * Date: 11/03/22
       */
    }
  }
}
