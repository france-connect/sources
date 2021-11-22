import * as _ from 'lodash';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import {
  lightResponseSuccessFullXmlMock,
  successFullJsonMock,
} from '../../fixtures';
import { EidasJsonToXmlException } from '../exceptions';
import { LightProtocolCommonsService } from './light-protocol-commons.service';
import { LightProtocolXmlService } from './light-protocol-xml.service';
import { LightResponseService } from './light-response.service';

describe('LightResponseService', () => {
  let service: LightResponseService;

  const configServiceMock = {
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
    forEachPath: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LightResponseService,
        ConfigService,
        LightProtocolCommonsService,
        LightProtocolXmlService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LightProtocolCommonsService)
      .useValue(lightCommonsServiceMock)
      .overrideProvider(LightProtocolXmlService)
      .useValue(lightXmlServiceMock)
      .compile();

    service = module.get<LightResponseService>(LightResponseService);

    lightCommonsServiceMock.getLastElementInUrlOrUrn.mockImplementation(
      LightProtocolCommonsService.prototype.getLastElementInUrlOrUrn,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('formatResponse', () => {
    const pathsObject = {
      'Is.That.A.Block.Chain': '?',
    };

    it('should call jsonToPathsObject with the eidas response', () => {
      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.jsonToPathsObject).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.jsonToPathsObject).toHaveBeenCalledWith(
        successFullJsonMock,
      );
    });

    it('should call replaceInPaths with the path object returned by jsonToPathsObject to add "lightResponse" key', () => {
      // setup
      lightXmlServiceMock.jsonToPathsObject.mockReturnValueOnce(pathsObject);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(3);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        1,
        pathsObject,
        /^/,
        'lightResponse.',
      );
    });

    it('should call dissociateDefinitionsAndValues to create a definition attribute and a value attribute for each attribute', () => {
      // setup
      service['dissociateDefinitionsAndValues'] = jest.fn();
      lightXmlServiceMock.replaceInPaths.mockReturnValueOnce(pathsObject);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(service['dissociateDefinitionsAndValues']).toHaveBeenCalledTimes(
        1,
      );
      expect(service['dissociateDefinitionsAndValues']).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should call upperCaseFirstCharForProps with the path object returned by the dissociateDefinitionsAndValues call to uppercase the definition of the identity attributes', () => {
      // setup
      service['dissociateDefinitionsAndValues'] = jest
        .fn()
        .mockReturnValueOnce(pathsObject);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(
        lightXmlServiceMock.upperCaseFirstCharForProps,
      ).toHaveBeenCalledTimes(1);
      expect(
        lightXmlServiceMock.upperCaseFirstCharForProps,
      ).toHaveBeenCalledWith(pathsObject, ['definition']);
    });

    it('should call prefixProps with the path object returned by upperCaseFirstCharForProps to add the namespace for eidas identity attributes', () => {
      // setup
      lightXmlServiceMock.upperCaseFirstCharForProps.mockReturnValueOnce(
        pathsObject,
      );

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.prefixProps).toHaveBeenCalledTimes(4);
      expect(lightXmlServiceMock.prefixProps).toHaveBeenNthCalledWith(
        1,
        pathsObject,
        ['definition'],
        'http://eidas.europa.eu/attributes/naturalperson/',
      );
    });

    it('should call replaceInPaths with the path object returned by the first call of prefixProps to inflate the attributes element', () => {
      // setup
      lightXmlServiceMock.prefixProps.mockReturnValueOnce(pathsObject);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(3);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        2,
        pathsObject,
        'attributes.',
        'attributes.attribute.',
      );
    });

    it('should call addDeclarationFields with the path object returned by the second call of replaceInPaths to add XML declaration fields', () => {
      // setup
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.addDeclarationFields).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.addDeclarationFields).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should call prefixProps with the path object returned by upperCaseFirstCharForProps to add the namespace for subjectNameIdFormat attribute', () => {
      // setup
      lightXmlServiceMock.addDeclarationFields.mockReturnValueOnce(pathsObject);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.prefixProps).toHaveBeenCalledTimes(4);
      expect(lightXmlServiceMock.prefixProps).toHaveBeenNthCalledWith(
        2,
        pathsObject,
        ['subjectNameIdFormat'],
        'urn:oasis:names:tc:SAML:2.0:nameid-format:',
      );
    });

    it('should call prefixProps with the path object returned by the second call of prefixProps to add the namespace for statusCode, subStatusCode attribute', () => {
      // setup
      lightXmlServiceMock.prefixProps
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.prefixProps).toHaveBeenCalledTimes(4);
      expect(lightXmlServiceMock.prefixProps).toHaveBeenNthCalledWith(
        3,
        pathsObject,
        ['statusCode', 'subStatusCode'],
        'urn:oasis:names:tc:SAML:2.0:status:',
      );
    });

    it('should call prefixProps with the path object returned by the third call of prefixProps to add the namespace for levelOfAssurance attribute', () => {
      // setup
      lightXmlServiceMock.prefixProps
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.prefixProps).toHaveBeenCalledTimes(4);
      expect(lightXmlServiceMock.prefixProps).toHaveBeenNthCalledWith(
        4,
        pathsObject,
        ['levelOfAssurance'],
        'http://eidas.europa.eu/LoA/',
      );
    });

    it('should call replaceInPaths with the path object returned by the fourth call of prefixProps to suffixe the lightResponse sub elements with "_text"', () => {
      // setup
      lightXmlServiceMock.prefixProps
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(3);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        3,
        pathsObject,
        /^lightResponse\.(.*)$/,
        'lightResponse.$1._text',
      );
    });

    it('should call pathsObjectToJson with the path object returned by the third replaceInPaths call to convert the paths object back to an inflated JSON', () => {
      // setup
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.pathsObjectToJson).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.pathsObjectToJson).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should call jsonToXml with the path object returned by the pathsObjectToJson call to convert JSON object to XML document', () => {
      // setup
      const inflatedJson = { Is: { That: { A: { Block: { Chain: '?' } } } } };
      lightXmlServiceMock.pathsObjectToJson.mockReturnValueOnce(inflatedJson);

      // action
      service.formatResponse(successFullJsonMock);

      // assertion
      expect(lightXmlServiceMock.jsonToXml).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.jsonToXml).toHaveBeenCalledWith(inflatedJson);
    });

    it('should return the result of jsonToXml ', () => {
      // setup
      lightXmlServiceMock.jsonToXml.mockReturnValueOnce(
        lightResponseSuccessFullXmlMock,
      );

      // action
      const result = service.formatResponse(successFullJsonMock);

      // assertion
      expect(result).toEqual(lightResponseSuccessFullXmlMock);
    });

    it('should throw a EidasJsonToXmlException error if jsonToXml thow', () => {
      // setup
      const jsonConversionErrorMessage = 'jsonConversion error';

      lightXmlServiceMock.jsonToXml.mockImplementation(() => {
        throw new Error(jsonConversionErrorMessage);
      });

      // action
      try {
        service.formatResponse(successFullJsonMock);
      } catch (e) {
        // assertion
        expect(e).toBeInstanceOf(EidasJsonToXmlException);
      }

      expect.hasAssertions();
    });
  });

  describe('generateToken', () => {
    const lightResponseProxyServiceSecret = 'lightResponseProxyServiceSecret';
    const id = 'id';
    const issuer = 'issuer';

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        lightResponseProxyServiceSecret,
      });
    });

    it('should get the lightResponseProxyServiceSecret from the config', () => {
      // action
      service.generateToken(id, issuer);

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasLightProtocol');
    });

    it('should call the light commons service with the given id and issuer, and the lightResponseProxyServiceSecret', () => {
      // action
      service.generateToken(id, issuer);

      // expect
      expect(lightCommonsServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(lightCommonsServiceMock.generateToken).toHaveBeenCalledWith(
        id,
        issuer,
        lightResponseProxyServiceSecret,
        undefined,
      );
    });

    it('should call the light commons service with the given id, issuer and date, and the lightResponseProxyServiceSecret', () => {
      // setup
      const date = new Date('1992-4-23');

      // action
      service.generateToken(id, issuer, date);

      // expect
      expect(lightCommonsServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(lightCommonsServiceMock.generateToken).toHaveBeenCalledWith(
        id,
        issuer,
        lightResponseProxyServiceSecret,
        date,
      );
    });
  });

  describe('parseResponse', () => {
    const pathsObject = {
      'Is.That.A.Block.Chain': '?',
    };

    it('should call xmlToJson with the XML given as argument', () => {
      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(lightXmlServiceMock.xmlToJson).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.xmlToJson).toHaveBeenCalledWith(
        lightResponseSuccessFullXmlMock,
      );
    });

    it('should call jsonToPathsObject with the JSON returned by xmlToJson', () => {
      // setup
      const inflatedJson = { Is: { That: { A: { Block: { Chain: '?' } } } } };
      lightXmlServiceMock.xmlToJson.mockReturnValueOnce(inflatedJson);

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(lightXmlServiceMock.jsonToPathsObject).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.jsonToPathsObject).toHaveBeenCalledWith(
        inflatedJson,
      );
    });

    it('should call removeDeclarationFields with the return of jsonToPathsObject to remove the XML declaration header', () => {
      // setup
      lightXmlServiceMock.jsonToPathsObject.mockReturnValueOnce(pathsObject);

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(lightXmlServiceMock.removeDeclarationFields).toHaveBeenCalledTimes(
        1,
      );
      expect(lightXmlServiceMock.removeDeclarationFields).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should call replaceInPaths with the return of the removeDeclarationFields call to transform single values to array in paths', () => {
      // setup
      lightXmlServiceMock.removeDeclarationFields.mockReturnValueOnce(
        pathsObject,
      );

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(5);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        1,
        pathsObject,
        'value._text',
        'value.0._text',
      );
    });

    it('should call replaceInPaths with the return of the first replaceInPaths call to strip unecessary properties in paths', () => {
      // setup
      lightXmlServiceMock.replaceInPaths.mockReturnValueOnce(pathsObject);

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(5);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        2,
        pathsObject,
        'lightResponse.',
        '',
      );
    });

    it('should call replaceInPaths with the return of the second replaceInPaths call to strip unecessary properties in paths', () => {
      // setup
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(5);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        3,
        pathsObject,
        '._text',
        '',
      );
    });

    it('should call replaceInPaths with the return of the third replaceInPaths call to strip unecessary properties in paths', () => {
      // setup
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(5);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        4,
        pathsObject,
        'attributes.attribute',
        'attributes',
      );
    });

    it('should call stripUrlAndUrnForProps with the return of the fourth replaceInPaths call to strip unnecessary url or urn elements in some props values', () => {
      // setup
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(lightXmlServiceMock.stripUrlAndUrnForProps).toHaveBeenCalledTimes(
        1,
      );
      expect(lightXmlServiceMock.stripUrlAndUrnForProps).toHaveBeenCalledWith(
        pathsObject,
        [
          'levelOfAssurance',
          'subjectNameIdFormat',
          'definition',
          'statusCode',
          'subStatusCode',
        ],
      );
    });

    it('should call lowerCaseFirstCharForProps with the return of the stripUrlAndUrnForProps call to lowercase the first character of definition', () => {
      // setup
      lightXmlServiceMock.stripUrlAndUrnForProps.mockReturnValueOnce(
        pathsObject,
      );

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(
        lightXmlServiceMock.lowerCaseFirstCharForProps,
      ).toHaveBeenCalledTimes(1);
      expect(
        lightXmlServiceMock.lowerCaseFirstCharForProps,
      ).toHaveBeenCalledWith(pathsObject, ['definition']);
    });

    it('should call mapValuesToDefinition with the return of the lowerCaseFirstCharForProps call to remap attributes to their corresponding definition', () => {
      // setup
      service['mapValuesToDefinition'] = jest.fn();
      lightXmlServiceMock.lowerCaseFirstCharForProps.mockReturnValueOnce(
        pathsObject,
      );

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(service['mapValuesToDefinition']).toHaveBeenCalledTimes(1);
      expect(service['mapValuesToDefinition']).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should call replaceInPaths with the return of the mapValuesToDefinition call to remove unnecessary array in attributes', () => {
      // setup
      service['mapValuesToDefinition'] = jest
        .fn()
        .mockReturnValueOnce(pathsObject);

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenCalledTimes(5);
      expect(lightXmlServiceMock.replaceInPaths).toHaveBeenNthCalledWith(
        5,
        pathsObject,
        /^attributes\.[0-9]+/,
        'attributes',
      );
    });

    it('should call failureAttributeToBoolean with the return of the fifth replaceInPaths call to transform failure boolean strings into booleans', () => {
      // setup
      service['failureAttributeToBoolean'] = jest.fn();
      lightXmlServiceMock.replaceInPaths
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce(pathsObject);

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(service['failureAttributeToBoolean']).toHaveBeenCalledTimes(1);
      expect(service['failureAttributeToBoolean']).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should call pathsObjectToJson with the return of the failureAttributeToBoolean call to convert the paths object back to an inflated JSON', () => {
      // setup
      service['failureAttributeToBoolean'] = jest
        .fn()
        .mockReturnValueOnce(pathsObject);

      // action
      service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(lightXmlServiceMock.pathsObjectToJson).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.pathsObjectToJson).toHaveBeenCalledWith(
        pathsObject,
      );
    });

    it('should return the result of the pathsObjectToJson call', () => {
      // setup
      const inflatedJson = { Is: { That: { A: { Block: { Chain: '?' } } } } };
      lightXmlServiceMock.pathsObjectToJson.mockReturnValueOnce(inflatedJson);

      // action
      const result = service.parseResponse(lightResponseSuccessFullXmlMock);

      // expect
      expect(result).toStrictEqual(inflatedJson);
    });
  });

  describe('parseToken', () => {
    const lightResponseConnectorSecret = 'lightResponseConnectorSecret';
    const token =
      'SGV5LCBzZXJpb3VzbHksIGRpZCB5b3UgcmVhbGx5IGV4cGVjdCB0byBmaW5kIHNtZXRoaW5nIGhlcmUgOkQgPw==';

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        lightResponseConnectorSecret,
      });
    });

    it('should get the lightResponseConnectorSecret from the config', () => {
      // action
      service.parseToken(token);

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasLightProtocol');
    });

    it('should call the light commons service with the given token, and the lightResponseConnectorSecret', () => {
      // action
      service.parseToken(token);

      // expect
      expect(lightCommonsServiceMock.parseToken).toHaveBeenCalledTimes(1);
      expect(lightCommonsServiceMock.parseToken).toHaveBeenCalledWith(
        token,
        lightResponseConnectorSecret,
      );
    });
  });

  describe('getDissociateDefinitionsAndValuesForPath', () => {
    it('should return a callback', () => {
      // setup
      const state = { index: 0, lastDefinition: undefined };

      // action
      const result = service['getDissociateDefinitionsAndValuesForPath'](state);

      // expect
      expect(result).toBeInstanceOf(Function);
    });

    describe('callback', () => {
      it('should return the key / value unmodified if it does not match "attributes"', () => {
        // setup
        const state = { index: 0, lastDefinition: undefined };
        const keyPath = 'do.not.transform.0';
        const value = '!';

        const expectedResult = [['do.not.transform.0', '!']];

        const cb = service['getDissociateDefinitionsAndValuesForPath'](state);

        // action
        const result = cb(keyPath, value);

        // expect
        expect(result).toStrictEqual(expectedResult);
      });

      it('should increment the state index if there is a state "lastDefinition" and it is not equal to the current definition', () => {
        // setup
        const state = { index: 0, lastDefinition: 'NotGender' };
        const keyPath = 'attributes.Gender.0';
        const value = 'Female';

        const cb = service['getDissociateDefinitionsAndValuesForPath'](state);

        // action
        cb(keyPath, value);

        // expect
        expect(state.index).toStrictEqual(1);
      });

      it('should not increment the state index if there is no state "lastDefinition"', () => {
        // setup
        const state = { index: 0 };
        const keyPath = 'attributes.Gender.0';
        const value = 'Female';

        const cb = service['getDissociateDefinitionsAndValuesForPath'](state);

        // action
        cb(keyPath, value);

        // expect
        expect(state.index).toStrictEqual(0);
      });

      it('should not increment the state index if there is a state "lastDefinition" and it is equal to the current definition', () => {
        // setup
        const state = { index: 0, lastDefinition: 'Gender' };
        const keyPath = 'attributes.Gender.0';
        const value = 'Female';

        const cb = service['getDissociateDefinitionsAndValuesForPath'](state);

        // action
        cb(keyPath, value);

        // expect
        expect(state.index).toStrictEqual(0);
      });

      it('should replace the "lastDefinition" with the current definition', () => {
        // setup
        const state = { index: 0, lastDefinition: 'Gender' };
        const keyPath = 'attributes.BirthDate.0';
        const value = '1992-04-23';

        const cb = service['getDissociateDefinitionsAndValuesForPath'](state);

        // action
        cb(keyPath, value);

        // expect
        expect(state.lastDefinition).toStrictEqual('BirthDate');
      });

      it('should replace the "lastDefinition" with the current definition', () => {
        // setup
        const state = { index: 0, lastDefinition: 'Gender' };
        const keyPath = 'attributes.BirthDate.0';
        const value = '1992-04-23';

        const cb = service['getDissociateDefinitionsAndValuesForPath'](state);

        // action
        cb(keyPath, value);

        // expect
        expect(state.lastDefinition).toStrictEqual('BirthDate');
      });

      it('should returns the dissociated definition and values with the right index', () => {
        // setup
        const state = { index: 5, lastDefinition: 'Gender' };
        const keyPath = 'attributes.Gender.0';
        const value = 'Male';

        const expected = [
          ['attributes.5.definition', 'Gender'],
          ['attributes.5.value.0', 'Male'],
        ];

        const cb = service['getDissociateDefinitionsAndValuesForPath'](state);

        // action
        const result = cb(keyPath, value);

        // expect
        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('dissociateDefinitionsAndValues', () => {
    const pathsObject = {
      'attributes.Gender.0': 'male',
      'attributes.BirthName.0': 'Ωνάσης',
      'attributes.BirthName.1': 'Onases',
    };

    it('should call getDissociateDefinitionsAndValuesForPath with the state of the function', () => {
      // setup
      service['getDissociateDefinitionsAndValuesForPath'] = jest.fn();
      const expectedState = { index: 0, lastDefinition: undefined };

      // action
      service['dissociateDefinitionsAndValues'](pathsObject);

      // expect
      expect(
        service['getDissociateDefinitionsAndValuesForPath'],
      ).toHaveBeenCalledTimes(1);
      expect(
        service['getDissociateDefinitionsAndValuesForPath'],
      ).toHaveBeenCalledWith(expectedState);
    });

    it('should call forEachPath from the light protocol xml library with a paths object and the callback returned by getDissociateDefinitionsAndValuesForPath', () => {
      // setup
      const mockCallback = jest.fn();
      service['getDissociateDefinitionsAndValuesForPath'] = jest
        .fn()
        .mockReturnValueOnce(mockCallback);

      // action
      service['dissociateDefinitionsAndValues'](pathsObject);

      // expect
      expect(lightXmlServiceMock.forEachPath).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        mockCallback,
      );
    });

    it('should return the result of the forEachPath call', () => {
      // setup
      const finalPathsObject = {
        ...pathsObject,
        'another.path.in.the.object': 'Another value',
      };
      lightXmlServiceMock.forEachPath.mockReturnValueOnce(finalPathsObject);

      // action
      const result = service['dissociateDefinitionsAndValues'](pathsObject);

      // expect
      expect(result).toStrictEqual(finalPathsObject);
    });
  });

  describe('getMapValuesToDefinitionForPath', () => {
    it('should return a callback', () => {
      // setup
      const state = { currentKey: undefined };

      // action
      const result = service['getMapValuesToDefinitionForPath'](state);

      // expect
      expect(result).toBeInstanceOf(Function);
    });

    describe('callback', () => {
      it('should return the path / value unmodified if it does not match either "definition" or "value"', () => {
        // setup
        const state = { currentKey: undefined };
        const keyPath = 'do.not.transform';
        const value = '!';

        const expectedResult = [['do.not.transform', '!']];

        const cb = service['getMapValuesToDefinitionForPath'](state);

        // action
        const result = cb(keyPath, value);

        // expect
        expect(result).toStrictEqual(expectedResult);
      });

      it('should store the key path in state.currentKey, replacing "definition" by the attribute name if the key path match "definition"', () => {
        // setup
        const state = { currentKey: undefined };
        const keyPath = 'attributes.0.definition';
        const value = 'Gender';

        const expectedResult = 'attributes.0.Gender';

        const cb = service['getMapValuesToDefinitionForPath'](state);

        // action
        cb(keyPath, value);

        // expect
        expect(state.currentKey).toStrictEqual(expectedResult);
      });

      it('should return "undefined" if the key path match "definition"', () => {
        // setup
        const state = { currentKey: undefined };
        const keyPath = 'attributes.0.definition';
        const value = 'Gender';

        const cb = service['getMapValuesToDefinitionForPath'](state);

        // action
        const result = cb(keyPath, value);

        // expect
        expect(result).toBeUndefined();
      });

      it('should store the key path in state.currentKey, replacing "definition" by the attribute name, if the key path match "definition"', () => {
        // setup
        const state = { currentKey: undefined };
        const keyPath = 'attributes.0.definition';
        const value = 'Gender';

        const expectedResult = 'attributes.0.Gender';

        const cb = service['getMapValuesToDefinitionForPath'](state);

        // action
        cb(keyPath, value);

        // expect
        expect(state.currentKey).toStrictEqual(expectedResult);
      });

      it('should return the path / value using the state "currentKey" and keeping the index if the key path match "value"', () => {
        // setup
        const state = { currentKey: 'attributes.Gender' };
        const keyPath = 'attributes.value.5';
        const value = 'Fluid';

        const expectedResult = [['attributes.Gender.5', 'Fluid']];

        const cb = service['getMapValuesToDefinitionForPath'](state);

        // action
        const result = cb(keyPath, value);

        // expect
        expect(result).toStrictEqual(expectedResult);
      });
    });
  });

  describe('mapValuesToDefinition', () => {
    const pathsObject = {
      // Paths object format, only way to go
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'attributes.0.definition._text': 'Gender',
      // Paths object format, only way to go
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'attributes.0.value._text': 'male',
      // Paths object format, only way to go
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'attributes.1.definition._text': 'BirthName',
      // Paths object format, only way to go
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'attributes.1.value.0._text': 'Ωνάσης',
      // Paths object format, only way to go
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'attributes.1.value.1._text': 'Onases',
    };

    it('should call getMapValuesToDefinitionForPath with the state of the function', () => {
      // setup
      service['getMapValuesToDefinitionForPath'] = jest.fn();
      const expectedState = { currentKey: undefined };

      // action
      service['mapValuesToDefinition'](pathsObject);

      // expect
      expect(service['getMapValuesToDefinitionForPath']).toHaveBeenCalledTimes(
        1,
      );
      expect(service['getMapValuesToDefinitionForPath']).toHaveBeenCalledWith(
        expectedState,
      );
    });

    it('should call forEachPath from the light protocol xml library with a paths object and the callback returned by getMapValuesToDefinitionForPath', () => {
      // setup
      const mockCallback = jest.fn();
      service['getMapValuesToDefinitionForPath'] = jest
        .fn()
        .mockReturnValueOnce(mockCallback);

      // action
      service['mapValuesToDefinition'](pathsObject);

      // expect
      expect(lightXmlServiceMock.forEachPath).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        mockCallback,
      );
    });

    it('should return the result of the forEachPath call', () => {
      // setup
      const finalPathsObject = {
        ...pathsObject,
        'another.path.in.the.object': 'Another value',
      };
      lightXmlServiceMock.forEachPath.mockReturnValueOnce(finalPathsObject);

      // action
      const result = service['mapValuesToDefinition'](pathsObject);

      // expect
      expect(result).toStrictEqual(finalPathsObject);
    });
  });

  describe('failureAttributeToBoolean', () => {
    const pathsObject = {
      'path.in.the.object': 'value',
    };

    it('should call forEachPath from the light protocol xml library with a paths object and the failureAttributeToBoolean function', () => {
      // setup
      service['failureAttributeToBooleanForPath'] = jest.fn();

      // action
      service['failureAttributeToBoolean'](pathsObject);

      // expect
      expect(lightXmlServiceMock.forEachPath).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        service['failureAttributeToBooleanForPath'],
      );
    });
  });

  describe('failureAttributeToBooleanForPath', () => {
    it('should return true as a boolean if the keyPath match "status.failure" and the value is the string "true"', () => {
      // setup
      const keyPath = 'status.failure';
      const value = 'true';

      const expected = [['status.failure', true]];

      // action
      const result = service['failureAttributeToBooleanForPath'](
        keyPath,
        value,
      );

      // expect
      expect(result).toStrictEqual(expected);
    });

    it('should return false as a boolean if the keyPath match "status.failure" and the value is the string "false"', () => {
      // setup
      const keyPath = 'status.failure';
      const value = 'false';

      const expected = [['status.failure', false]];

      // action
      const result = service['failureAttributeToBooleanForPath'](
        keyPath,
        value,
      );

      // expect
      expect(result).toStrictEqual(expected);
    });

    it('should return the keyPath and the value without edition if the keyPath does not match "status.failure"', () => {
      // setup
      const keyPath = 'do.not.touch';
      const value = 'false';

      const expected = [['do.not.touch', 'false']];

      // action
      const result = service['failureAttributeToBooleanForPath'](
        keyPath,
        value,
      );

      // expect
      expect(result).toStrictEqual(expected);
    });
  });

  describe('failureAttributeToBoolean', () => {
    it('should call forEachPath from the light protocol xml library with a paths object and the failureAttributeToBoolean function', () => {
      // setup
      const pathsObject = {
        'path.in.the.object': 'value',
      };
      service['failureAttributeToBooleanForPath'] = jest.fn();

      // action
      service['failureAttributeToBoolean'](pathsObject);

      // expect
      expect(lightXmlServiceMock.forEachPath).toHaveBeenCalledTimes(1);
      expect(lightXmlServiceMock.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        service['failureAttributeToBooleanForPath'],
      );
    });

    it('should return the result of the forEachPath call', () => {
      // setup
      const pathsObject = {
        'path.in.the.object': 'value',
      };
      const finalPathsObject = {
        ...pathsObject,
        'another.path.in.the.object': 'Another value',
      };
      lightXmlServiceMock.forEachPath.mockReturnValueOnce(finalPathsObject);

      // action
      const result = service['failureAttributeToBoolean'](pathsObject);

      // expect
      expect(result).toStrictEqual(finalPathsObject);
    });
  });
});
