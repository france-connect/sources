import * as _ from 'lodash';
import * as xmlParser from 'xml2js';

import { Test } from '@nestjs/testing';

import {
  rnippCorectResponseXml,
  rnippCorrectResponseParsed,
  rnippNotFoundResponseParsed,
  rnippPresumedDayMonthResponseParsed,
  rnippPresumedDayResponseParsed,
} from '../../fixtures';
import { Genders, RnippResponseCodes, RnippXmlSelectors } from '../enums';
import { RnippHttpStatusException } from '../exceptions';
import { RnippResponseParserService } from './rnipp-response-parser.service';

describe('RnippResponseParserService', () => {
  let service: RnippResponseParserService;

  const valueMock = Symbol('value');

  const rnippIdentityMock = {
    gender: 'female',
    // openid claim
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'DUBOIS',
    // openid claim
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Angela Claire Louise',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name_array: ['Angela', 'Claire', 'Louise'],
    birthdate: '1962-08-24',
    birthplace: '75107',
    birthcountry: '99100',
  };

  const xmlParserOptions = {
    tagNameProcessors: [xmlParser.processors.stripPrefix],
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module = await Test.createTestingModule({
      providers: [RnippResponseParserService],
    }).compile();

    service = module.get<RnippResponseParserService>(
      RnippResponseParserService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseRnippData', () => {
    beforeEach(() => {
      jest
        .spyOn(xmlParser, 'parseStringPromise')
        .mockResolvedValueOnce(rnippCorrectResponseParsed);
      service['extractXmlAttributes'] = jest
        .fn()
        .mockReturnValue(rnippIdentityMock);
    });

    it('should call "parseStringPromise" with the given XML', async () => {
      // action
      await service.parseRnippData(rnippCorectResponseXml);

      // expect
      expect(xmlParser.parseStringPromise).toHaveBeenCalledTimes(1);
      expect(xmlParser.parseStringPromise).toHaveBeenCalledWith(
        rnippCorectResponseXml,
        xmlParserOptions,
      );
    });

    it('should call "extractXmlAttributes" with the result of "parseStringPromise"', async () => {
      // action
      await service.parseRnippData(rnippCorectResponseXml);

      // expect
      expect(service['extractXmlAttributes']).toHaveBeenCalledTimes(1);
      expect(service['extractXmlAttributes']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
      );
    });

    it('should return the result of "extractXmlAttributes"', async () => {
      // action
      const result = await service.parseRnippData(rnippCorectResponseXml);

      // expect
      expect(result).toStrictEqual(rnippIdentityMock);
    });

    it('should throw a "RnippHttpStatusException" with the error thrown by "parseStringPromise"', async () => {
      // setup
      const parseStringPromiseErrorMessage =
        'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
      jest.spyOn(xmlParser, 'parseStringPromise').mockRestore();
      jest
        .spyOn(xmlParser, 'parseStringPromise')
        .mockRejectedValueOnce(new Error(parseStringPromiseErrorMessage));

      // action
      try {
        await service.parseRnippData(rnippCorectResponseXml);
      } catch (e) {
        expect(e).toBeInstanceOf(RnippHttpStatusException);
        expect(e.message).toStrictEqual(parseStringPromiseErrorMessage);
      }

      // expect
      expect.hasAssertions();
    });
  });

  describe('extractXmlAttributes', () => {
    beforeEach(() => {
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce(RnippResponseCodes.FOUND_NOT_RECTIFIED)
        .mockReturnValueOnce(rnippIdentityMock.family_name);
      service['getDeceasedStateAttribute'] = jest.fn().mockReturnValue(false);
      service['getGenderFromParsedXml'] = jest
        .fn()
        .mockReturnValue(rnippIdentityMock.gender);
      service['getGivenNamesAttribute'] = jest.fn().mockReturnValue({
        givenName: rnippIdentityMock.given_name,
        givenNameArray: rnippIdentityMock.given_name_array,
      });
      service['getBirthplaceAttribute'] = jest
        .fn()
        .mockReturnValue(rnippIdentityMock.birthplace);
      service['getBirthcountryAttribute'] = jest
        .fn()
        .mockReturnValue(rnippIdentityMock.birthcountry);
      service['getBirthdateAttribute'] = jest
        .fn()
        .mockReturnValue(rnippIdentityMock.birthdate);
    });

    it('should extract the "rnippCode" attribute from the parsed XML by calling "getXmlAttribute"', () => {
      // action
      service['extractXmlAttributes'](
        rnippCorrectResponseParsed as unknown as JSON,
      );

      // expect
      expect(service['getXmlAttribute']).toHaveBeenCalledTimes(2);
      expect(service['getXmlAttribute']).toHaveBeenNthCalledWith(
        1,
        rnippCorrectResponseParsed,
        RnippXmlSelectors.RNIPP_CODE,
      );
    });

    it('should extract the "deceased" attribute from the parsed XML by calling "getDeceasedStateAttribute"', () => {
      // action
      service['extractXmlAttributes'](
        rnippCorrectResponseParsed as unknown as JSON,
      );

      // expect
      expect(service['getDeceasedStateAttribute']).toHaveBeenCalledTimes(1);
      expect(service['getDeceasedStateAttribute']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.DECEASED,
      );
    });

    it('should extract the "gender" attribute from the parsed XML by calling "getGenderFromParsedXml"', () => {
      // action
      service['extractXmlAttributes'](
        rnippCorrectResponseParsed as unknown as JSON,
      );

      // expect
      expect(service['getGenderFromParsedXml']).toHaveBeenCalledTimes(1);
      expect(service['getGenderFromParsedXml']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.GENDER,
      );
    });

    it('should extract the "family_name" attribute from the parsed XML by calling "getXmlAttribute"', () => {
      // action
      service['extractXmlAttributes'](
        rnippCorrectResponseParsed as unknown as JSON,
      );

      // expect
      expect(service['getXmlAttribute']).toHaveBeenCalledTimes(2);
      expect(service['getXmlAttribute']).toHaveBeenNthCalledWith(
        2,
        rnippCorrectResponseParsed,
        RnippXmlSelectors.FAMILY_NAME,
      );
    });

    it('should extract the "given_name" attribute from the parsed XML by calling "getGivenNamesAttribute"', () => {
      // action
      service['extractXmlAttributes'](
        rnippCorrectResponseParsed as unknown as JSON,
      );

      // expect
      expect(service['getGivenNamesAttribute']).toHaveBeenCalledTimes(1);
      expect(service['getGivenNamesAttribute']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.GIVEN_NAME,
      );
    });

    it('should extract the "birthdate" attribute from the parsed XML by calling "getBirthdateAttribute"', () => {
      // action
      service['extractXmlAttributes'](
        rnippCorrectResponseParsed as unknown as JSON,
      );

      // expect
      expect(service['getBirthdateAttribute']).toHaveBeenCalledTimes(1);
      expect(service['getBirthdateAttribute']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.BIRTH_DATE,
      );
    });

    it('should extract the "birthplace" attribute from the parsed XML by calling "getBirthplaceAttribute"', () => {
      // action
      service['extractXmlAttributes'](
        rnippCorrectResponseParsed as unknown as JSON,
      );

      // expect
      expect(service['getBirthplaceAttribute']).toHaveBeenCalledTimes(1);
      expect(service['getBirthplaceAttribute']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.BIRTH_PLACE,
        rnippIdentityMock.birthcountry,
      );
    });

    it('should extract the "birthcountry" attribute from the parsed XML by calling "getBirthcountryAttribute"', () => {
      // action
      service['extractXmlAttributes'](
        rnippCorrectResponseParsed as unknown as JSON,
      );

      // expect
      expect(service['getBirthcountryAttribute']).toHaveBeenCalledTimes(1);
      expect(service['getBirthcountryAttribute']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.BIRTH_PLACE,
        RnippXmlSelectors.BIRTH_COUNTRY,
      );
    });

    it('should return the status of the citizen', () => {
      // action
      const result = service['extractXmlAttributes'](
        rnippCorrectResponseParsed as unknown as JSON,
      );

      // expect
      expect(result).toEqual({
        rnippCode: RnippResponseCodes.FOUND_NOT_RECTIFIED,
        identity: rnippIdentityMock,
        deceased: false,
      });
    });

    it('should return only the rnippCode if its value is neither "RnippResponseCodes.FOUND_NOT_RECTIFIED" or "RnippResponseCodes.FOUND_RECTIFIED"', () => {
      // setup
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce(RnippResponseCodes.NOT_FOUND_NO_ECHO);

      // action
      const result = service['extractXmlAttributes'](
        rnippNotFoundResponseParsed as unknown as JSON,
      );

      // expect
      expect(result).toEqual({
        rnippCode: RnippResponseCodes.NOT_FOUND_NO_ECHO,
      });
    });
  });

  describe('getGenderFromParsedXml', () => {
    it('should call "getXmlAttribute" with the "rnippCorrectResponseParsed" and "RnippXmlSelectors.GENDER"', () => {
      service['getXmlAttribute'] = jest.fn();

      // action
      service['getGenderFromParsedXml'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.GENDER,
      );

      // expect
      expect(service['getXmlAttribute']).toHaveBeenCalledTimes(1);
      expect(service['getXmlAttribute']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.GENDER,
      );
    });

    it('should return "female" if "getXmlAttribute" returns "F"', () => {
      service['getXmlAttribute'] = jest.fn().mockReturnValueOnce('F');

      // action
      const result = service['getGenderFromParsedXml'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.GENDER,
      );

      // expect
      expect(result).toStrictEqual(Genders.FEMALE);
    });

    it('should return "male" if "getXmlAttribute" returns "M"', () => {
      service['getXmlAttribute'] = jest.fn().mockReturnValueOnce('M');

      // action
      const result = service['getGenderFromParsedXml'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.GENDER,
      );

      // expect
      expect(result).toStrictEqual(Genders.MALE);
    });

    it('should return "unspecified" if "getXmlAttribute" returns "U"', () => {
      service['getXmlAttribute'] = jest.fn().mockReturnValueOnce('U');

      // action
      const result = service['getGenderFromParsedXml'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.GENDER,
      );

      // expect
      expect(result).toStrictEqual(Genders.UNSPECIFIED);
    });

    it('should return "" by default if "getXmlAttribute" returns any other', () => {
      service['getXmlAttribute'] = jest.fn().mockReturnValueOnce('H');

      // action
      const result = service['getGenderFromParsedXml'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.GENDER,
      );

      // expect
      expect(result).toStrictEqual('');
    });
  });

  describe('getXmlAttribute', () => {
    beforeEach(() => {
      jest.spyOn(_, 'get').mockReturnValueOnce(valueMock);
    });

    it('should call "_.get" with the parsed XML, the path to follow in the parsed XML and the default "defaultValue"', () => {
      // action
      service['getXmlAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.RNIPP_CODE,
      );

      // expect
      expect(_.get).toHaveBeenCalledTimes(1);
      expect(_.get).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.RNIPP_CODE,
        '',
      );
    });

    it('should call "_.get" with the parsed XML, the path to follow in the parsed XML and the provided "defaultValue"', () => {
      // setup
      const defaultValue = 42;

      // action
      service['getXmlAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.RNIPP_CODE,
        defaultValue,
      );

      // expect
      expect(_.get).toHaveBeenCalledTimes(1);
      expect(_.get).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.RNIPP_CODE,
        defaultValue,
      );
    });

    it('should return the result of "_.get" call', () => {
      // action
      const result = service['getXmlAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.RNIPP_CODE,
      );

      // expect
      expect(result).toStrictEqual(valueMock);
    });
  });

  describe('getGivenNamesAttribute', () => {
    it('should call "getXmlAttribute" with the parsed XML, the path to follow in the parsed XML and "[]" as default value', () => {
      // action
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce([rnippIdentityMock.given_name]);
      service['getGivenNamesAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.GIVEN_NAME,
      );

      // expect
      expect(service['getXmlAttribute']).toHaveBeenCalledTimes(1);
      expect(service['getXmlAttribute']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.GIVEN_NAME,
        [],
      );
    });

    it('should return the "joined" result of "getXmlAttribute"', () => {
      // action
      const result = service['getGivenNamesAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.GIVEN_NAME,
      );
      // expect
      expect(result).toStrictEqual({
        givenName: rnippIdentityMock.given_name,
        givenNameArray: rnippIdentityMock.given_name_array,
      });
    });
  });

  describe('getDeceasedStateAttribute', () => {
    beforeEach(() => {
      service['getXmlAttribute'] = jest.fn();
    });

    it('should call "getXmlAttribute" with the parsed XML, the path to follow in the parsed XML and "false" as default value', () => {
      // action
      service['getDeceasedStateAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.DECEASED,
      );

      // expect
      expect(service['getXmlAttribute']).toHaveBeenCalledTimes(1);
      expect(service['getXmlAttribute']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.DECEASED,
        false,
      );
    });

    it('should return false if the "deceased" attribute is not found in the XML', () => {
      // setup
      service['getXmlAttribute'] = jest.fn().mockReturnValueOnce(false);

      // action
      const result = service['getDeceasedStateAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.DECEASED,
      );

      // expect
      expect(result).toStrictEqual(false);
    });

    it('should return true if the "deceased" attribute is found in the XML', () => {
      // setup
      service['getXmlAttribute'] = jest.fn().mockReturnValueOnce('deceased');

      // action
      const result = service['getDeceasedStateAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.DECEASED,
      );

      // expect
      expect(result).toStrictEqual(true);
    });
  });

  describe('getBirthdateAttribute', () => {
    it('should call "getXmlAttribute" with the parsed XML with the birthdate path', () => {
      // Given
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce(rnippIdentityMock.birthdate);
      // When
      service['getBirthdateAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_DATE,
      );
      // Then
      expect(service['getXmlAttribute']).toHaveBeenCalledTimes(1);
      expect(service['getXmlAttribute']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.BIRTH_DATE,
      );
    });

    it('should return the birthdate with correct format YYYY-MM-DD', () => {
      // Given
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce(rnippIdentityMock.birthdate);
      // When
      const result = service['getBirthdateAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_DATE,
      );
      // Then
      expect(result).toStrictEqual(rnippIdentityMock.birthdate);
    });

    it('should return the birthdate with correct format YYYY-MM-01 (presumed day)', () => {
      // Given
      service['getXmlAttribute'] = jest.fn().mockReturnValueOnce('1962-08');
      // When
      const result = service['getBirthdateAttribute'](
        rnippPresumedDayResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_DATE,
      );
      // Then
      expect(result).toStrictEqual('1962-08-01');
    });

    it('should return the birthdate with correct format YYYY-01-01 (presumed day and month)', () => {
      // Given
      service['getXmlAttribute'] = jest.fn().mockReturnValueOnce('1962');
      // When
      const result = service['getBirthdateAttribute'](
        rnippPresumedDayMonthResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_DATE,
      );
      // Then
      expect(result).toStrictEqual('1962-01-01');
    });
  });

  describe('getBirthplaceAttribute', () => {
    it('should call "getXmlAttribute" with the parsed XML, first the "birthplace" path, second with the "birthcountry"', () => {
      // Given
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce(rnippIdentityMock.birthplace);
      service['getBirthcountryAttribute'] = jest
        .fn()
        .mockReturnValueOnce(rnippIdentityMock.birthcountry);
      // When
      service['getBirthplaceAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_PLACE,
        RnippXmlSelectors.BIRTH_COUNTRY,
      );
      // Then
      expect(service['getXmlAttribute']).toHaveBeenCalledTimes(1);
      expect(service['getXmlAttribute']).toHaveBeenCalledWith(
        rnippCorrectResponseParsed,
        RnippXmlSelectors.BIRTH_PLACE,
      );
    });

    it('should return birthplace if user born in France', () => {
      // Given
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce(rnippIdentityMock.birthplace);
      // When
      const result = service['getBirthplaceAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_PLACE,
        rnippIdentityMock.birthcountry,
      );
      // Then
      expect(result).toStrictEqual(rnippIdentityMock.birthplace);
    });

    it('should return empty string for birthplace if birthcountry is empty', () => {
      // Given
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce(rnippIdentityMock.birthplace);
      // When
      const result = service['getBirthplaceAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_PLACE,
        '',
      );
      // Then
      expect(result).toStrictEqual('');
    });

    it('should return empty string for birthplace if user not born in France', () => {
      // Given
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce(rnippIdentityMock.birthplace);
      // When
      const result = service['getBirthplaceAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_PLACE,
        '99217',
      );
      // Then
      expect(result).toStrictEqual('');
    });
  });

  describe('getBirthcountryAttribute', () => {
    beforeEach(() => {
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce(rnippIdentityMock.birthplace)
        .mockReturnValueOnce(rnippIdentityMock.birthcountry);
    });

    it('should call "getXmlAttribute" with the parsed XML, first the "birthplace" path, second with the "birthcountry"', () => {
      // action
      service['getBirthcountryAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_PLACE,
        RnippXmlSelectors.BIRTH_COUNTRY,
      );

      // expect
      expect(service['getXmlAttribute']).toHaveBeenCalledTimes(2);
      expect(service['getXmlAttribute']).toHaveBeenNthCalledWith(
        1,
        rnippCorrectResponseParsed,
        RnippXmlSelectors.BIRTH_PLACE,
      );
      expect(service['getXmlAttribute']).toHaveBeenNthCalledWith(
        2,
        rnippCorrectResponseParsed,
        RnippXmlSelectors.BIRTH_COUNTRY,
      );
    });

    it('should return the "birthcountry" cog if found', () => {
      // action
      const result = service['getBirthcountryAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_PLACE,
        RnippXmlSelectors.BIRTH_COUNTRY,
      );

      // expect
      expect(result).toStrictEqual(rnippIdentityMock.birthcountry);
    });

    it('should return "99100" if the "birthcountry" cog is not found and the "birthplace" cog is found', () => {
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce(rnippIdentityMock.birthplace)
        .mockReturnValueOnce('');

      // action
      const result = service['getBirthcountryAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_PLACE,
        RnippXmlSelectors.BIRTH_COUNTRY,
      );

      // expect
      expect(result).toStrictEqual('99100');
    });

    it('should return "" if the "birthcountry" cog nd the "birthplace" cog are not found', () => {
      service['getXmlAttribute'] = jest
        .fn()
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      // action
      const result = service['getBirthcountryAttribute'](
        rnippCorrectResponseParsed as unknown as JSON,
        RnippXmlSelectors.BIRTH_PLACE,
        RnippXmlSelectors.BIRTH_COUNTRY,
      );

      // expect
      expect(result).toStrictEqual('');
    });
  });
});
