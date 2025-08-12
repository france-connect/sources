import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule, ConfigService } from '@fc/config';

import { lightRequestXmlMock, requestJsonMock } from '../../fixtures';
import { EidasJsonToXmlException } from '../exceptions';
import { LightProtocolCommonsService } from './light-protocol-commons.service';
import { LightProtocolXmlService } from './light-protocol-xml.service';
import { LightRequestService } from './light-request.service';

describe('LightRequestService', () => {
  let service: LightRequestService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const lightCommonsServiceMock = {
    generateToken: jest.fn(),
    parseToken: jest.fn(),
    getLastElementInUrlOrUrn: jest.fn(),
  };

  const lightXmlServiceMock = {
    jsonToPathsObject: jest.fn(),
    replaceInPaths: jest.fn(),
    addDeclarationFields: jest.fn(),
    upperCaseFirstCharForProps: jest.fn(),
    prefixProps: jest.fn(),
    pathsObjectToJson: jest.fn(),
    jsonToXml: jest.fn(),
    xmlToJson: jest.fn(),
    removeDeclarationFields: jest.fn(),
    stripUrlAndUrnForProps: jest.fn(),
    lowerCaseFirstCharForProps: jest.fn(),
    upsertNodeToPathObject: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        LightRequestService,
        ConfigService,
        LightProtocolCommonsService,
        LightProtocolXmlService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(LightProtocolCommonsService)
      .useValue(lightCommonsServiceMock)
      .overrideProvider(LightProtocolXmlService)
      .useValue(lightXmlServiceMock)
      .compile();

    service = module.get<LightRequestService>(LightRequestService);

    lightCommonsServiceMock.getLastElementInUrlOrUrn.mockImplementation(
      LightProtocolCommonsService.prototype.getLastElementInUrlOrUrn,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('formatRequest', () => {
    const pathsObject = {
      'Is.That.A.Block.Chain': '?',
    };

    it('should call jsonToPathsObject with the eidas request', () => {
      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.jsonToPathsObject).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.jsonToPathsObject).toHaveBeenCalledWith(
        requestJsonMock,
      );
    });

    it('should call replaceInPaths with the path object returned by jsonToPathsObject to add "lightRequest" key', () => {
      // Given
      lightXmlServiceMock.jsonToPathsObject.mockReturnValueOnce(pathsObject);

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(3);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        1,
        pathsObject,
        /^/,
        'lightRequest.',
      );
    });

    it('should call addDeclarationFields with the path object returned by replaceInPaths to add XML declaration fields', () => {
      // Given
      lightXmlServiceMock.replaceInPaths.mockReturnValueOnce(pathsObject);

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.addDeclarationFields).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.addDeclarationFields).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should call replaceInPaths with the path object returned by addDeclarationFields to add the "lightRequest" key)', () => {
      // Given
      lightXmlServiceMock.addDeclarationFields.mockReturnValueOnce(pathsObject);

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(3);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        2,
        pathsObject,
        /requestedAttributes\.([0-9]+)/,
        'requestedAttributes.attribute.$1.definition',
      );
    });

    it('should call upperCaseFirstCharForProps with the path object returned by the second call of replaceInPaths to uppercase the value of requested attributes', () => {
      // Given
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(
        lightXmlServiceMock.upperCaseFirstCharForProps,
      ).toHaveBeenCalledTimes(1);
      expect(
        lightXmlServiceMock.upperCaseFirstCharForProps,
      ).toHaveBeenCalledWith(pathsObject, ['requestedAttributes']);
    });

    it('should call prefixProps with the path object returned by upperCaseFirstCharForProps to add the namespace on the requested attributes', () => {
      // Given
      lightXmlServiceMock.upperCaseFirstCharForProps.mockReturnValueOnce(
        pathsObject,
      );

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.prefixProps).toHaveBeenCalledTimes(3);
      expect(lightXmlServiceMock.prefixProps).toHaveBeenNthCalledWith(
        1,
        pathsObject,
        ['requestedAttributes'],
        'http://eidas.europa.eu/attributes/naturalperson/',
      );
    });

    it('should call prefixProps with the path object returned by the first prefixProps call to add the namespace for nameIdFormat attribute', () => {
      // Given
      lightXmlServiceMock.prefixProps.mockReturnValueOnce(pathsObject);

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.prefixProps).toHaveBeenCalledTimes(3);
      expect(lightXmlServiceMock.prefixProps).toHaveBeenNthCalledWith(
        2,
        pathsObject,
        ['nameIdFormat'],
        'urn:oasis:names:tc:SAML:1.1:nameid-format:',
      );
    });

    it('should call prefixProps with the path object returned by the second prefixProps call to add the namespace for levelOfAssurance attribute', () => {
      // Given
      lightXmlServiceMock.prefixProps
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.prefixProps).toHaveBeenCalledTimes(3);
      expect(lightXmlServiceMock.prefixProps).toHaveBeenNthCalledWith(
        3,
        pathsObject,
        ['levelOfAssurance'],
        'http://eidas.europa.eu/LoA/',
      );
    });

    it('should call replaceInPaths with the path object returned by the third prefixProps call to suffixe the lightRequest sub elements with "_text"', () => {
      // Given
      lightXmlServiceMock.prefixProps
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(3);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        3,
        pathsObject,
        /^lightRequest\.(.*)$/,
        'lightRequest.$1._text',
      );
    });

    it('should call upsertNodeToPathObject with the path object returned by the replaceInPaths call to convert the paths object back to an inflated JSON', () => {
      // Given
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.upsertNodeToPathObject).toHaveBeenCalledTimes(
        1,
      );
      expect(lightXmlServiceMock.upsertNodeToPathObject).toHaveBeenCalledWith(
        pathsObject,
        'lightRequest._attributes.xmlns',
        'http://cef.eidas.eu/LightRequest',
      );
    });

    it('should call pathsObjectToJson with the path object returned by upsertNodeToPathObject call to convert the paths object back to an inflated JSON', () => {
      // Given
      lightXmlServiceMock.upsertNodeToPathObject.mockReturnValueOnce(
        pathsObject,
      );

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.pathsObjectToJson).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.pathsObjectToJson).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should call jsonToXml with the path object returned by the pathsObjectToJson call to convert JSON object to XML document', () => {
      // Given
      const inflatedJson = { Is: { That: { A: { Block: { Chain: '?' } } } } };
      lightXmlServiceMock.pathsObjectToJson.mockReturnValueOnce(inflatedJson);

      // When
      service.formatRequest(requestJsonMock);

      // Then
      expect(lightXmlServiceMock.jsonToXml).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.jsonToXml).toHaveBeenCalledWith(inflatedJson);
    });

    it('should return the result of jsonToXml ', () => {
      // Given
      lightXmlServiceMock.jsonToXml.mockReturnValueOnce(lightRequestXmlMock);

      // When
      const result = service.formatRequest(requestJsonMock);

      // Then
      expect(result).toEqual(lightRequestXmlMock);
    });

    it('should throw a EidasJsonToXmlException error if jsonToXml thow', () => {
      // Given
      const jsonConversionErrorMessage = 'jsonConversion error';

      lightXmlServiceMock.jsonToXml.mockImplementation(() => {
        throw new Error(jsonConversionErrorMessage);
      });

      // When
      try {
        service.formatRequest(requestJsonMock);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(EidasJsonToXmlException);
      }

      expect.hasAssertions();
    });
  });

  describe('generateToken', () => {
    const issuer = 'yeltsA-kciR';
    const id = 'NGGYU';
    const mockConfig = {
      lightRequestConnectorSecret: '?v=dQw4w9WgXcQ',
    };

    beforeEach(() => {
      mockConfigService.get.mockReturnValueOnce(mockConfig);
    });

    it('should get the lightRequestConnectorSecret from the config', () => {
      // Given
      const expectedConfigName = 'EidasLightProtocol';

      // When
      service.generateToken(id, issuer);

      // Then
      expect(mockConfigService.get).toHaveBeenCalledTimes(1);
      expect(mockConfigService.get).toHaveBeenCalledWith(expectedConfigName);
    });

    it('should call LightCommons.generateToken with the id, the issuer and the lightRequestConnectorSecret', () => {
      // Given
      const expectedDate = undefined;

      // When
      service.generateToken(id, issuer);

      // Then
      expect(lightCommonsServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(lightCommonsServiceMock.generateToken).toHaveBeenCalledWith(
        id,
        issuer,
        mockConfig.lightRequestConnectorSecret,
        expectedDate,
      );
    });

    it('should call LightCommons.generateToken with a specific date if the date argument is set', () => {
      // Given
      const expectedDate = new Date(Date.UTC(2012, 6, 4));

      // When
      service.generateToken(id, issuer, expectedDate);

      // Then
      expect(lightCommonsServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(lightCommonsServiceMock.generateToken).toHaveBeenCalledWith(
        id,
        issuer,
        mockConfig.lightRequestConnectorSecret,
        expectedDate,
      );
    });

    it('should return the result of LightCommons.generateToken call', () => {
      // Given
      /**
       * This is the expected token for the data described in the beforeEach section
       */
      const expected =
        'eWVsdHNBLWtjaVJ8TkdHWVV8MTk2OS0wNy0yMSAxNzo1NDowMCAwMDB8eFR6aUwyWVZ2U09SYUVEUFBiZFNwOVZvR3k3OEJ4bjNhY3pVcGhnWFozdz0=';
      lightCommonsServiceMock.generateToken.mockReturnValueOnce(expected);

      // When
      const result = service.generateToken(id, issuer);

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('parseRequest', () => {
    const pathsObject = {
      'Is.That.A.Block.Chain': '?',
    };

    it('should call xmlToJson with the XML given as argument', () => {
      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(lightXmlServiceMock.xmlToJson).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.xmlToJson).toHaveBeenCalledWith(
        lightRequestXmlMock,
      );
    });

    it('should call jsonToPathsObject with the JSON returned by xmlToJson', () => {
      // Given
      const inflatedJson = { Is: { That: { A: { Block: { Chain: '?' } } } } };
      lightXmlServiceMock.xmlToJson.mockReturnValueOnce(inflatedJson);

      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(lightXmlServiceMock.jsonToPathsObject).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.jsonToPathsObject).toHaveBeenCalledWith(
        inflatedJson,
      );
    });

    it('should call removeDeclarationFields with the return of jsonToPathsObject to remove the XML declaration header', () => {
      // Given
      lightXmlServiceMock.jsonToPathsObject.mockReturnValueOnce(pathsObject);

      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(lightXmlServiceMock.removeDeclarationFields).toHaveBeenCalledTimes(
        1,
      );
      expect(lightXmlServiceMock.removeDeclarationFields).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should call replaceInPaths with the return of the removeDeclarationFields call to transform single values to array in paths', () => {
      // Given
      lightXmlServiceMock.removeDeclarationFields.mockReturnValueOnce(
        pathsObject,
      );

      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(5);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        1,
        pathsObject,
        'value._text',
        'value.0._text',
      );
    });

    it('should call replaceInPaths with the return of the first replaceInPaths call to strip unecessary properties in paths', () => {
      // Given
      lightXmlServiceMock.replaceInPaths.mockReturnValueOnce(pathsObject);

      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(5);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        2,
        pathsObject,
        'lightRequest.',
        '',
      );
    });

    it('should call replaceInPaths with the return of the second replaceInPaths call to strip unecessary properties in paths', () => {
      // Given
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(5);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        3,
        pathsObject,
        '._text',
        '',
      );
    });

    it('should call replaceInPaths with the return of the third replaceInPaths call to strip unecessary properties in paths', () => {
      // Given
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(5);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        4,
        pathsObject,
        '.definition',
        '',
      );
    });

    it('should call replaceInPaths with the return of the fourth replaceInPaths call to strip unecessary properties in paths', () => {
      // Given
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(5);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        5,
        pathsObject,
        '.attribute',
        '',
      );
    });

    it('should call stripUrlAndUrnForProps with the return of the fifth replaceInPaths call to strip unnecessary url or urn elements in some props values', () => {
      // Given
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(lightXmlServiceMock.stripUrlAndUrnForProps).toHaveBeenCalledTimes(
        1,
      );
      expect(lightXmlServiceMock.stripUrlAndUrnForProps).toHaveBeenCalledWith(
        pathsObject,
        ['levelOfAssurance', 'nameIdFormat', 'requestedAttributes'],
      );
    });

    it('should call lowerCaseFirstCharForProps with the return of the stripUrlAndUrnForProps call to lowercase the first character of requested attributes', () => {
      // Given
      lightXmlServiceMock.stripUrlAndUrnForProps.mockReturnValueOnce(
        pathsObject,
      );

      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(
        lightXmlServiceMock.lowerCaseFirstCharForProps,
      ).toHaveBeenCalledTimes(1);
      expect(
        lightXmlServiceMock.lowerCaseFirstCharForProps,
      ).toHaveBeenCalledWith(pathsObject, ['requestedAttributes']);
    });

    it('should call pathsObjectToJson with the return of the lowerCaseFirstCharForProps call to convert the paths object back to an inflated JSON', () => {
      // Given
      lightXmlServiceMock.lowerCaseFirstCharForProps.mockReturnValueOnce(
        pathsObject,
      );

      // When
      service.parseRequest(lightRequestXmlMock);

      // Then
      expect(lightXmlServiceMock.pathsObjectToJson).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.pathsObjectToJson).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should return the result of the pathsObjectToJson call', () => {
      // Given
      const inflatedJson = { Is: { That: { A: { Block: { Chain: '?' } } } } };
      lightXmlServiceMock.pathsObjectToJson.mockReturnValueOnce(inflatedJson);

      // When
      const result = service.parseRequest(lightRequestXmlMock);

      // Then
      expect(result).toStrictEqual(inflatedJson);
    });
  });

  describe('parseToken', () => {
    const mockConfig = {
      lightRequestProxyServiceSecret: '?v=dQw4w9WgXcQ',
    };
    const token = 'avc';

    beforeEach(() => {
      mockConfigService.get.mockReturnValueOnce(mockConfig);
    });

    it('should get the lightRequestProxyServiceSecret from the config', () => {
      // Given
      const expectedConfigName = 'EidasLightProtocol';

      // When
      service.parseToken(token);

      // Then
      expect(mockConfigService.get).toHaveBeenCalledTimes(1);
      expect(mockConfigService.get).toHaveBeenCalledWith(expectedConfigName);
    });

    it('should call parseToken from the light commons service with the token and the lightRequestProxyServiceSecret', () => {
      // When
      service.parseToken(token);

      // Then
      expect(lightCommonsServiceMock.parseToken).toHaveBeenCalledTimes(1);
      expect(lightCommonsServiceMock.parseToken).toHaveBeenCalledWith(
        token,
        mockConfig.lightRequestProxyServiceSecret,
      );
    });

    it('should return the parsed token', () => {
      // Given
      const parsedToken = {
        id: 'id',
        issuer: 'issuer',
        date: new Date(),
      };
      lightCommonsServiceMock.parseToken.mockReturnValueOnce(parsedToken);

      // When
      const result = service.parseToken(token);

      // Then
      expect(result).toStrictEqual(parsedToken);
    });
  });
});
