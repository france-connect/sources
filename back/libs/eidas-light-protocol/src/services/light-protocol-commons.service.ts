import { createHash } from 'crypto';

import * as moment from 'moment';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { EidasLightProtocolConfig } from '../dto';
import {
  EidasInvalidTokenChecksumException,
  EidasOversizedTokenException,
} from '../exceptions';
import { IParsedToken } from '../interfaces';

@Injectable()
export class LightProtocolCommonsService {
  constructor(private readonly config: ConfigService) {}

  /**
   * Produce a token as defined as describe in the documentation in the README.md
   * @param id An id unique for the TTL of the token and used as key for caching
   * @param issuer The entity that is emitting the token
   * @param secret Used for controlling the origin and integrity of the token
   * @param date The date of the token emission
   * @returns The produced token encoded in base64
   */
  generateToken(
    id: string,
    issuer: string,
    secret: string,
    date?: Date,
  ): string {
    const finalDate = moment(date).format('YYYY-MM-DD HH:mm:ss SSS');

    const digest = this.generateTokenDigest(id, issuer, secret, finalDate);

    const lRToken = `${issuer}|${id}|${finalDate}|${digest}`;

    return Buffer.from(lRToken, 'utf8').toString('base64');
  }

  /**
   * Takes a token and parse it while validating it as described in README.md
   * @param token The token base64 encoded
   * @param secret Used for controlling the origin and integrity of the token
   * @returns An id as key for caching, the issuer of the token and the date of the emission of the token
   */
  parseToken(token: string, secret: string): IParsedToken {
    const { maxTokenSize } =
      this.config.get<EidasLightProtocolConfig>('EidasLightProtocol');

    if (token.length > maxTokenSize) {
      throw new EidasOversizedTokenException();
    }

    const decodedToken = Buffer.from(token, 'base64').toString('utf8');

    const [issuer, id, date, decodedDigest] = decodedToken.split('|');

    const computedDigest = this.generateTokenDigest(id, issuer, secret, date);

    if (decodedDigest !== computedDigest) {
      throw new EidasInvalidTokenChecksumException();
    }

    return {
      issuer,
      id,
      date: moment(date, 'YYYY-MM-DD HH:mm:ss SSS').toDate(),
    };
  }

  /**
   * Retrieves the last part of an URL or URN (can be an Enum)
   * Ex. "toto" in "titi:tutu:tata:toto"
   * @param value The element we want to parse
   * @returns the last element
   */
  getLastElementInUrlOrUrn<T>(value: string): T {
    return value.split(/[:/]/).pop() as unknown as T;
  }

  /**
   * Produce a SHA256 signature for a token
   * @param id An id unique for the TTL of the token and used as key for caching
   * @param issuer The entity that is emitting the token
   * @param secret Used for controlling the origin and integrity of the token
   * @param date The date of the token emission
   * @returns A digest base64 encoded
   */
  private generateTokenDigest(
    id: string,
    issuer: string,
    secret: string,
    date: string,
  ): string {
    const hash = createHash('sha256');
    hash.update(`${id}|${issuer}|${date}|${secret}`);

    return hash.digest('base64');
  }
}
