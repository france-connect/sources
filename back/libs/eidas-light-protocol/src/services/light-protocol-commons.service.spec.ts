import * as crypto from 'crypto';

import * as luxon from 'luxon';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import {
  EidasInvalidTokenChecksumException,
  EidasOversizedTokenException,
} from '../exceptions';
import { LightProtocolCommonsService } from './light-protocol-commons.service';

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
    beforeEach(() => {
      service['generateTokenDigest'] = jest
        .fn()
        .mockReturnValueOnce(tokenDigestMock);
    });

    it('should call luxon with the date argument and the expected format if date is present present', () => {
      // setup
      const expectedDate = new Date('2012-06-04');
      const fromJSDateSpy = jest.spyOn(luxon.DateTime, 'fromJSDate');
      const toFormatSpy = jest.spyOn(luxon.DateTime.prototype, 'toFormat');

      // action
      service.generateToken(id, issuer, secretMock, expectedDate);

      // expect
      expect(fromJSDateSpy).toHaveBeenCalledTimes(1);
      expect(fromJSDateSpy).toHaveBeenCalledWith(expectedDate);
      expect(toFormatSpy).toHaveBeenCalledTimes(1);
      expect(toFormatSpy).toHaveBeenCalledWith('yyyy-MM-dd HH:mm:ss SSS');
    });

    it('should call luxon with a new date and the expected format if date argument is not present', () => {
      // setup
      const fromJSDateSpy = jest.spyOn(luxon.DateTime, 'fromJSDate');
      const toFormatSpy = jest.spyOn(luxon.DateTime.prototype, 'toFormat');

      // action
      service.generateToken(id, issuer, secretMock);

      // expect
      expect(fromJSDateSpy).toHaveBeenCalledTimes(1);
      expect(fromJSDateSpy.mock.calls[0][0]).toBeInstanceOf(Date);
      expect(toFormatSpy).toHaveBeenCalledTimes(1);
      expect(toFormatSpy).toHaveBeenCalledWith('yyyy-MM-dd HH:mm:ss SSS');
    });

    it('should generate the token digest with the id, the issuer and the date extracted from the token and the secret', () => {
      //setup
      jest.spyOn(luxon.DateTime.prototype, 'toFormat').mockReturnValue(date);

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
      jest.spyOn(luxon.DateTime.prototype, 'toFormat').mockReturnValue(date);

      // action
      const result = service.generateToken(id, issuer, secretMock);

      // expect
      expect(result).toStrictEqual(encodedTokenMock);
    });
  });

  describe('parseToken', () => {
    const decodedDigesMock = 'decodedDigesMock';
    const toStringMock = jest.fn().mockReturnValueOnce({
      issuer: issuer,
      id,
      date,
      decodedDigest: decodedDigesMock,
    });

    beforeEach(() => {
      mockConfigService.get.mockReturnValueOnce({ maxTokenSize });

      service['generateTokenDigest'] = jest
        .fn()
        .mockReturnValueOnce(tokenDigestMock);

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

    it('should throw if decodedDigest is different from computedDigest', () => {
      // setup
      service['generateTokenDigest'] = jest
        .fn()
        .mockReturnValueOnce('tokenDigestMock');

      //expect
      expect(
        // When
        () => service.parseToken(encodedTokenMock, secretMock),
        // Then
      ).toThrow(EidasInvalidTokenChecksumException);
    });

    it('should create a native date object from the string formatted "YYYY-MM-DD HH:mm:ss SSS"', () => {
      // setup
      const FromFormatSpy = jest.spyOn(luxon.DateTime, 'fromFormat');
      const ToJSDateSpy = jest.spyOn(luxon.DateTime.prototype, 'toJSDate');

      // action
      service.parseToken(encodedTokenMock, secretMock);

      // expect
      expect(FromFormatSpy).toHaveBeenCalledTimes(1);
      expect(FromFormatSpy).toHaveBeenCalledWith(
        date,
        'yyyy-MM-dd:HH:mm:ss.SSS',
      );

      expect(ToJSDateSpy).toHaveBeenCalledTimes(1);
      expect(ToJSDateSpy).toHaveBeenCalledWith();
    });

    it('should return the payload elements parsed but not the digest', () => {
      // setup
      const newDateMock = luxon.DateTime.fromFormat(
        date,
        'yyyy-MM-dd:HH:mm:ss.SSS',
      ).toJSDate();
      jest
        .spyOn(luxon.DateTime.prototype, 'toJSDate')
        .mockReturnValue(newDateMock);

      // action
      const result = service.parseToken(encodedTokenMock, secretMock);

      // expect
      expect(result).toStrictEqual({
        issuer,
        id,
        date: newDateMock,
      });
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
    it('should create a base64 digested sha256 signature hash with id, issuer, mockSecret, date and lightRequestSecret in this order', () => {
      // setup
      const expectedHash = 'sha256';
      const expectedData = `${id}|${issuer}|${date}|${secretMock}`;
      const expectedDigest = 'base64';
      const mockUpdate = jest.fn();
      const mockDigest = jest.fn().mockReturnValueOnce('toto');
      jest.spyOn(crypto, 'createHash').mockReturnValueOnce({
        update: mockUpdate,
        digest: mockDigest,
      } as unknown as crypto.Hash);

      // action
      service['generateTokenDigest'](id, issuer, secretMock, date);

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
      const result = service['generateTokenDigest'](
        id,
        issuer,
        secretMock,
        date,
      );

      // expect
      expect(result).toStrictEqual(tokenDigestMock);
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
