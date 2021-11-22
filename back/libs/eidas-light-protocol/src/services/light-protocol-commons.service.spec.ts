import * as crypto from 'crypto';

import * as moment from 'moment';
import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import {
  EidasInvalidTokenChecksumException,
  EidasOversizedTokenException,
} from '../exceptions';
import { LightProtocolCommonsService } from './light-protocol-commons.service';

jest.mock('moment', () => jest.fn());

describe('LightProtocolCommonsService', () => {
  let service: LightProtocolCommonsService;

  const issuer = 'yeltsA-kciR';
  const id = 'NGGYU';
  const date = '1969-07-20 20:17:40 000';
  const secretMock = '?v=dQw4w9WgXcQ';

  const maxTokenSize = 2048;
  const tokenDigestMock = 'fO57Zc0k+8SZQ4kxKSmgMbCNMXQSDFWOz2DJfaqt8+s=';
  const decodedTokenMock = `${issuer}|${id}|${date}|${tokenDigestMock}`;
  const encodedTokenMock = Buffer.from(decodedTokenMock, 'utf8').toString(
    'base64',
  );

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LightProtocolCommonsService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    service = module.get<LightProtocolCommonsService>(
      LightProtocolCommonsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    const formatMock = jest.fn();
    beforeEach(() => {
      mocked(moment, true).mockReturnValueOnce({
        format: formatMock,
      } as unknown as moment.Moment);

      formatMock.mockReturnValueOnce(date);

      service['generateTokenDigest'] = jest
        .fn()
        .mockReturnValueOnce(tokenDigestMock);
    });

    it('should create a date with format "YYYY-MM-DD HH:mm:ss SSS"', () => {
      // setup
      const expectedDate = undefined;
      const expectedFormat = 'YYYY-MM-DD HH:mm:ss SSS';

      // action
      service.generateToken(id, issuer, secretMock);

      // expect
      expect(moment).toHaveBeenCalledTimes(1);
      expect(moment).toHaveBeenCalledWith(expectedDate);

      expect(formatMock).toHaveBeenCalledTimes(1);
      expect(formatMock).toHaveBeenCalledWith(expectedFormat);
    });

    it('should call moment with the date argument if present', () => {
      // setup
      const expectedDate = new Date('2012-06-04');

      // action
      service.generateToken(id, issuer, secretMock, expectedDate);

      // expect
      expect(moment).toHaveBeenCalledTimes(1);
      expect(moment).toHaveBeenCalledWith(expectedDate);
    });

    it('should generate the token digest with the id, the issuer and the date extracted from the token and the secret', () => {
      // action
      service.generateToken(id, issuer, secretMock);

      // expect
      expect(service['generateTokenDigest']).toHaveBeenCalledTimes(1);
      expect(service['generateTokenDigest']).toHaveBeenCalledWith(
        id,
        issuer,
        secretMock,
        date,
      );
    });

    it('should create a base64 encoded light request with the issuer, id, date, and the signature', () => {
      // setup
      const formatMock = jest.fn().mockReturnValueOnce(date);
      mocked(moment, true).mockReturnValueOnce({
        format: formatMock,
      } as unknown as moment.Moment);

      // action
      const result = service.generateToken(id, issuer, secretMock);

      // expect
      expect(result).toStrictEqual(encodedTokenMock);
    });
  });

  describe('parseToken', () => {
    const toDateMock = jest.fn();
    const toStringMock = jest.fn();
    const fakeDate = 'By Osiris and Isis, this is a date, *o*, a date !';

    beforeEach(() => {
      mockConfigService.get.mockReturnValueOnce({ maxTokenSize });

      service['generateTokenDigest'] = jest
        .fn()
        .mockReturnValueOnce(tokenDigestMock);

      toDateMock.mockReturnValueOnce(fakeDate);
      mocked(moment, true).mockReturnValueOnce({
        toDate: toDateMock,
      } as unknown as moment.Moment);

      toStringMock.mockReturnValueOnce(decodedTokenMock);
      jest
        .spyOn(Buffer, 'from')
        .mockReturnValueOnce({ toString: toStringMock } as unknown as Buffer);
    });

    it('sould retrieve the maxTokenSize from the config', () => {
      // action
      service.parseToken(encodedTokenMock, secretMock);

      // expect
      expect(mockConfigService.get).toHaveBeenCalledTimes(1);
      expect(mockConfigService.get).toHaveBeenCalledWith('EidasLightProtocol');
    });

    it('should decode the base64 to utf8', () => {
      // action
      service.parseToken(encodedTokenMock, secretMock);

      // expect
      expect(Buffer.from).toHaveBeenCalledTimes(1);
      expect(Buffer.from).toHaveBeenCalledWith(encodedTokenMock, 'base64');

      expect(toStringMock).toHaveBeenCalledTimes(1);
      expect(toStringMock).toHaveBeenCalledWith('utf8');
    });

    it('should generate the token digest with the id, the issuer and the date extracted from the token and the secret', () => {
      // action
      service.parseToken(encodedTokenMock, secretMock);

      // expect
      expect(service['generateTokenDigest']).toHaveBeenCalledTimes(1);
      expect(service['generateTokenDigest']).toHaveBeenCalledWith(
        id,
        issuer,
        secretMock,
        date,
      );
    });

    it('should create a native date object from the string fromated "YYYY-MM-DD HH:mm:ss SSS"', () => {
      // action
      service.parseToken(encodedTokenMock, secretMock);

      // expect
      expect(moment).toHaveBeenCalledTimes(1);
      expect(moment).toHaveBeenCalledWith(date, 'YYYY-MM-DD HH:mm:ss SSS');

      expect(toDateMock).toHaveBeenCalledTimes(1);
      expect(toDateMock).toHaveBeenCalledWith();
    });

    it('should return the payload elements parsed but not the digest', () => {
      const expected = {
        id,
        issuer,
        date: fakeDate,
      };

      // action
      const result = service.parseToken(encodedTokenMock, secretMock);

      // expect
      expect(result).toStrictEqual(expected);
    });

    it('should throw an EidasOversizedTokenException if the token size is over the config maxTokenSize', () => {
      // setup
      mockConfigService.get
        .mockReset()
        .mockReturnValueOnce({ maxTokenSize: 0 });

      // action / expect
      expect(() =>
        service.parseToken(encodedTokenMock, secretMock),
      ).toThrowError(EidasOversizedTokenException);
    });

    it('should throw an EidasInvalidTokenChecksumException if the calculated digest does not equal the light token digest', () => {
      // setup
      service['generateTokenDigest'] = jest
        .fn()
        .mockReturnValueOnce('Not the expected digest');

      // action / expect
      expect(() =>
        service.parseToken(encodedTokenMock, secretMock),
      ).toThrowError(EidasInvalidTokenChecksumException);
    });
  });

  describe('generateTokenDigest', () => {
    const mockFormat = jest.fn();
    beforeEach(() => {
      mockFormat.mockReturnValueOnce(date);

      mocked(moment, true).mockReturnValueOnce({
        format: mockFormat,
      } as unknown as moment.Moment);
    });

    it('should create a base64 digested sha256 signature hash with id, issuer, mockSecret, date and lightRequestSecret in this order', () => {
      // setup
      const expectedHash = 'sha256';
      const expectedData = `${id}|${issuer}|${date}|${secretMock}`;
      const expectedDigest = 'base64';
      const mockUpdate = jest.fn();
      const mockDigest = jest.fn();
      jest.spyOn(crypto, 'createHash').mockReturnValueOnce({
        update: mockUpdate,
        digest: mockDigest,
      } as unknown as crypto.Hash);

      // action
      service.generateToken(id, issuer, secretMock);

      // expect
      expect(crypto.createHash).toHaveBeenCalledTimes(1);
      expect(crypto.createHash).toHaveBeenCalledWith(expectedHash);

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith(expectedData);

      expect(mockDigest).toHaveBeenCalledTimes(1);
      expect(mockDigest).toHaveBeenCalledWith(expectedDigest);
    });

    it('should return the digest', () => {
      // action
      const result = service.generateToken(id, issuer, secretMock);

      // expect
      expect(result).toStrictEqual(encodedTokenMock);
    });
  });

  describe('getLastElementInUrlOrUrn', () => {
    it('should return all the string after the last slash', () => {
      // setup
      const url =
        'http://eidas.europa.eu/attributes/naturalperson/personIdentifier';

      // action
      const result = service['getLastElementInUrlOrUrn'](url);

      // expect
      expect(result).toEqual('personIdentifier');
    });

    it('should return all the string after the last semicolon', () => {
      // setup
      const urn = 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified';

      // action
      const result = service['getLastElementInUrlOrUrn'](urn);

      // expect
      expect(result).toEqual('unspecified');
    });
  });
});
