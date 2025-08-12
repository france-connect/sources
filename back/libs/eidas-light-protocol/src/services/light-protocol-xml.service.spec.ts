import * as converter from 'xml-js';

import { Test, TestingModule } from '@nestjs/testing';

import {
  lightResponseSuccessFullJsonMock,
  lightResponseSuccessFullXmlMock,
} from '../../fixtures';
import {
  EidasJsonToXmlException,
  EidasXmlToJsonException,
} from '../exceptions';
import { LightProtocolXmlService } from './light-protocol-xml.service';

describe('LightProtocolXmlService', () => {
  let service;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LightProtocolXmlService],
    }).compile();

    service = module.get<LightProtocolXmlService>(LightProtocolXmlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('xmlToJson', () => {
    it('should call xml2json function from xml2js library', () => {
      // Given
      jest
        .spyOn(converter, 'xml2json')
        .mockReturnValueOnce(JSON.stringify(lightResponseSuccessFullJsonMock));

      // When
      service.xmlToJson(lightResponseSuccessFullXmlMock);

      // Then
      expect(converter.xml2json).toHaveBeenCalledTimes(1);
      expect(converter.xml2json).toHaveBeenCalledWith(
        lightResponseSuccessFullXmlMock,
        {
          compact: true,
          spaces: 2,
        },
      );
    });

    it('should return the JSON returned by xml2json', () => {
      // Given
      jest
        .spyOn(converter, 'xml2json')
        .mockReturnValueOnce(JSON.stringify(lightResponseSuccessFullJsonMock));

      // When
      const result = service.xmlToJson(lightResponseSuccessFullXmlMock);

      // Then
      expect(result).toStrictEqual(lightResponseSuccessFullJsonMock);
    });

    it('should throw an error if the library receive something else than a string', () => {
      // Given
      const lightResponseSuccessFullXmlMock = 'tryAgainBuddyYoureMistaken';
      const xmlConversionErrorMessage = `Error message`;

      jest.spyOn(converter, 'json2xml').mockImplementation(() => {
        throw new Error(xmlConversionErrorMessage);
      });

      // When
      try {
        service.xmlToJson(lightResponseSuccessFullXmlMock);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(EidasXmlToJsonException);
      }

      expect.hasAssertions();
    });
  });

  describe('jsonToXml', () => {
    it('should call json2xml function from xml2js library', () => {
      // Given
      jest
        .spyOn(converter, 'json2xml')
        .mockReturnValueOnce(lightResponseSuccessFullXmlMock);
      // When
      service.jsonToXml(lightResponseSuccessFullJsonMock);

      // Then
      expect(converter.json2xml).toHaveBeenCalledTimes(1);
      expect(converter.json2xml).toHaveBeenCalledWith(
        JSON.stringify(lightResponseSuccessFullJsonMock),
        {
          compact: true,
          ignoreComment: true,
          spaces: 2,
        },
      );
    });

    it('should return the XML document returned by json2xml', () => {
      // Given
      jest
        .spyOn(converter, 'json2xml')
        .mockReturnValueOnce(lightResponseSuccessFullXmlMock);

      // When
      const result = service.jsonToXml(lightResponseSuccessFullJsonMock);

      // Then
      expect(result).toEqual(lightResponseSuccessFullXmlMock);
    });

    it('should throw an error if the library receive something else than a JSON object', () => {
      // Given
      const jsonConversionErrorMessage = 'jsonConversion error';

      jest.spyOn(converter, 'json2xml').mockImplementation(() => {
        throw new Error(jsonConversionErrorMessage);
      });
      // When
      try {
        service.jsonToXml(lightResponseSuccessFullJsonMock);
      } catch (e) {
        // Then
        expect(e).toBeInstanceOf(EidasJsonToXmlException);
      }

      expect.hasAssertions();
    });
  });

  describe('jsonToPathsObject', () => {
    it('should set the last path with the parent in the tree if the parent is a string', () => {
      // Given
      const parent = 'Whisper';
      const lastPath = 'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta';
      const tree = {};

      const expectedTree = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta': 'Whisper',
      };

      // When
      service.jsonToPathsObject(parent, lastPath, tree);

      // Then
      expect(tree).toStrictEqual(expectedTree);
    });

    it('should call recurseOnChildBasedOnType with the parent and the callback if the parent is not a string', () => {
      // Given
      service.recurseOnChildBasedOnType = jest.fn();
      const parent = { Samishisa: 'Of' };
      const lastPath = 'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta';
      const tree = {};

      // When
      service.jsonToPathsObject(parent, lastPath, tree);

      // Then
      expect(service.recurseOnChildBasedOnType).toHaveBeenCalledTimes(1);
      expect(service.recurseOnChildBasedOnType).toHaveBeenCalledWith(
        'Of',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Samishisa',
        {},
      );
    });

    it('should return the tree when no other processing is required', () => {
      // Given
      const parent = { Samishisa: 'Of' };
      const lastPath = 'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta';
      const tree = {};

      const expectedTree = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Samishisa': 'Of',
      };

      // When
      const result = service.jsonToPathsObject(parent, lastPath, tree);

      // Then
      expect(result).toStrictEqual(expectedTree);
    });

    it('should create the path object if it not exists', () => {
      // Given
      const parent = { Samishisa: 'Of' };
      const lastPath = undefined;
      const tree = {};

      const expectedTree = {
        Samishisa: 'Of',
      };

      // When
      const result = service.jsonToPathsObject(parent, lastPath, tree);

      // Then
      expect(result).toStrictEqual(expectedTree);
    });

    it('should work the same with all default values', () => {
      // Given
      const parent = { Samishisa: 'Of' };

      const expectedTree = {
        Samishisa: 'Of',
      };

      // When
      const result = service.jsonToPathsObject(parent);

      // Then
      expect(result).toStrictEqual(expectedTree);
    });

    it('should return the last tree if the parent is other than a string, an array or an object', () => {
      // Given
      const parent = 3;
      const lastPath = 'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta';
      const tree = { last: '1' };

      const expectedTree = { last: '1' };

      // When
      const result = service.jsonToPathsObject(parent, lastPath, tree);

      // Then
      expect(result).toStrictEqual(expectedTree);
    });

    it('should return the last tree if the child is a null value', () => {
      // Given
      const parent = { new: null };
      const lastPath = 'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta';
      const tree = { last: '1' };

      const expectedTree = { last: '1' };

      // When
      const result = service.jsonToPathsObject(parent, lastPath, tree);

      // Then
      expect(result).toStrictEqual(expectedTree);
    });

    it('should return the tree when no other processing is required but with a more complexe structure', () => {
      // Given
      const parent = { Samishisa: { Oshi: 'The' } };
      const lastPath = 'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta';
      const tree = {};

      const expectedTree = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Samishisa.Oshi': 'The',
      };

      // When
      const result = service.jsonToPathsObject(parent, lastPath, tree);

      // Then
      expect(result).toStrictEqual(expectedTree);
    });

    it('should return the tree when no other processing is required but with an even more complexe structure', () => {
      // Given
      const parent = {
        Hitori: {
          Botchi: 'Whipser',
        },
        Osorezuni: {
          Ikiyou: 'Of',
        },
        To: [{ Yume: 'The' }, { Miteta: 'Heart' }],
      };
      const lastPath = 'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta';
      const tree = {};

      const expectedTree = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Hitori.Botchi':
          'Whipser',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Osorezuni.Ikiyou': 'Of',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.0.Yume': 'The',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.1.Miteta': 'Heart',
      };

      // When
      const result = service.jsonToPathsObject(parent, lastPath, tree);

      // Then
      expect(result).toStrictEqual(expectedTree);
    });
  });

  describe('recurseOnChildBasedOnType', () => {
    it('should set the last path with the child in the tree if the child is a string', () => {
      // Given
      const child = 'Whisper';
      const lastPath = 'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume';
      const tree = {};

      const expectedTree = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume': 'Whisper',
      };

      // When
      service['recurseOnChildBasedOnType'](child, lastPath, tree);

      // Then
      expect(tree).toStrictEqual(expectedTree);
    });

    it('should set the last path with the child in the tree if the child is an object', () => {
      // Given
      const child = { Miteta: 'Whisper' };
      const lastPath = 'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume';
      const tree = {};

      const expectedTree = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta': 'Whisper',
      };

      // When
      service['recurseOnChildBasedOnType'](child, lastPath, tree);

      // Then
      expect(tree).toStrictEqual(expectedTree);
    });

    it('should set the last path with the child in the tree if the child is an array', () => {
      // Given
      const child = { Miteta: ['foo', 'bar'] };
      const lastPath = 'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume';
      const tree = {};

      const expectedTree = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.0': 'foo',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.1': 'bar',
      };

      // When
      service['recurseOnChildBasedOnType'](child, lastPath, tree);

      // Then
      expect(tree).toStrictEqual(expectedTree);
    });
  });

  describe('removeDeclarationFields', () => {
    const pathsObject = {
      _declaration: 'blah blah blah',
      pouet: 'pouet',
    };

    it('should call forEachPath to iter over paths', () => {
      // Given
      service.forEachPath = jest.fn();

      // When
      service.removeDeclarationFields(pathsObject);

      // Then
      expect(service.forEachPath).toHaveBeenCalledTimes(1);
      expect(service.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        expect.any(Function),
      );
    });

    it('should return the paths object without the XML declaration feilds', () => {
      // Given
      const expected = { pouet: 'pouet' };

      // When
      const result = service.removeDeclarationFields(pathsObject);

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should not a affect the paths object', () => {
      const originalPathsObject = {
        _declaration: 'blah blah blah',
        pouet: 'pouet',
      };

      // When
      service.removeDeclarationFields(pathsObject);

      // Then
      expect(pathsObject).toStrictEqual(originalPathsObject);
    });
  });

  describe('addDeclarationFields', () => {
    const pathsObject = {
      pouet: 'pouet',
    };

    it('should add the declaration fields to the path object', () => {
      // When
      const result = service.addDeclarationFields(pathsObject);

      // Then
      expect(result).toStrictEqual({
        '_declaration._attributes.encoding': 'UTF-8',
        '_declaration._attributes.standalone': 'yes',
        '_declaration._attributes.version': '1.0',
        pouet: 'pouet',
      });
    });

    it('should not a affect the paths object', () => {
      const originalPathsObject = {
        pouet: 'pouet',
      };

      // When
      service.addDeclarationFields(pathsObject);

      // Then
      expect(pathsObject).toStrictEqual(originalPathsObject);
    });
  });

  describe('upsertNodeToPathObject', () => {
    const pathsObject = {
      pouet: 'pouet',
    };

    it('should add the given node and value in the path object', () => {
      // When
      const result = service.upsertNodeToPathObject(pathsObject, 'foo', 'bar');

      // Then
      expect(result).toStrictEqual({
        foo: 'bar',
        pouet: 'pouet',
      });
    });

    it('should override the paths object', () => {
      // When
      const result = service.upsertNodeToPathObject(
        pathsObject,
        'pouet',
        'pas pouet',
      );

      // Then
      expect(result).toStrictEqual({
        pouet: 'pas pouet',
      });
    });
  });

  describe('stripUrlAndUrnForProps', () => {
    const pathsObject = {
      'Ceci.est.un.test.pouet.0.a': 'https://toto.fr/titi/tutu',
      'Ceci.est.un.test.Miyazaki.b': '89',
      'Ceci.est.un.test.toto.c': 'urn:name:42',
    };

    it('should call forEachPath to iter over paths', () => {
      // Given
      service.forEachPath = jest.fn();

      // When
      service.stripUrlAndUrnForProps(pathsObject, ['pouet', 'toto']);

      // Then
      expect(service.forEachPath).toHaveBeenCalledTimes(1);
      expect(service.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        expect.any(Function),
      );
    });

    it('should keep the last element of url and urn for paths that match the given props', () => {
      const expectedPathsObject = {
        'Ceci.est.un.test.Miyazaki.b': '89',
        'Ceci.est.un.test.pouet.0.a': 'tutu',
        'Ceci.est.un.test.toto.c': '42',
      };

      // When
      const result = service.stripUrlAndUrnForProps(pathsObject, [
        'pouet',
        'toto',
      ]);

      // Then
      expect(result).toStrictEqual(expectedPathsObject);
    });

    it('should not a affect the paths object', () => {
      const originalPathsObject = {
        'Ceci.est.un.test.pouet.0.a': 'https://toto.fr/titi/tutu',
        'Ceci.est.un.test.Miyazaki.b': '89',
        'Ceci.est.un.test.toto.c': 'urn:name:42',
      };

      // When
      service.stripUrlAndUrnForProps(pathsObject, ['pouet', 'toto']);

      // Then
      expect(pathsObject).toStrictEqual(originalPathsObject);
    });
  });

  describe('prefixProps', () => {
    const pathsObject = {
      'Ceci.est.un.test.Miyazaki.b': '89',
      'Ceci.est.un.test.pouet.0.a': 'tutu',
      'Ceci.est.un.test.toto.c': '42',
    };

    it('should call forEachPath to iter over paths', () => {
      // Given
      service.forEachPath = jest.fn();

      // When
      service.prefixProps(pathsObject, ['toto'], 'urn:name:');

      // Then
      expect(service.forEachPath).toHaveBeenCalledTimes(1);
      expect(service.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        expect.any(Function),
      );
    });

    it('should prefix values for paths that match the given props', () => {
      // Given
      const expectedPathsObject = {
        'Ceci.est.un.test.Miyazaki.b': '89',
        'Ceci.est.un.test.pouet.0.a': 'tutu',
        'Ceci.est.un.test.toto.c': 'urn:name:42',
      };

      // When
      const result = service.prefixProps(pathsObject, ['toto'], 'urn:name:');

      // Then
      expect(result).toStrictEqual(expectedPathsObject);
    });

    it('should not a affect the paths object', () => {
      const originalPathsObject = {
        'Ceci.est.un.test.pouet.0.a': 'tutu',
        'Ceci.est.un.test.Miyazaki.b': '89',
        'Ceci.est.un.test.toto.c': '42',
      };

      // When
      service.prefixProps(pathsObject, ['pouet', 'toto'], 'urn:name:');

      // Then
      expect(pathsObject).toStrictEqual(originalPathsObject);
    });
  });

  describe('lowerCaseFirstCharForProps', () => {
    const pathsObject = {
      'Ceci.est.un.test.Miyazaki.b': '89',
      'Ceci.est.un.test.pouet.0.a': 'tutu',
      'Ceci.est.un.test.toto.c': 'LesLapinsCretins',
    };

    it('should call forEachPath to iter over paths', () => {
      // Given
      service.forEachPath = jest.fn();

      // When
      service.lowerCaseFirstCharForProps(pathsObject, ['toto']);

      // Then
      expect(service.forEachPath).toHaveBeenCalledTimes(1);
      expect(service.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        expect.any(Function),
      );
    });

    it('should prefix values for paths that match the given props', () => {
      // Given
      const expectedPathsObject = {
        'Ceci.est.un.test.Miyazaki.b': '89',
        'Ceci.est.un.test.pouet.0.a': 'tutu',
        'Ceci.est.un.test.toto.c': 'lesLapinsCretins',
      };

      // When
      const result = service.lowerCaseFirstCharForProps(pathsObject, ['toto']);

      // Then
      expect(result).toStrictEqual(expectedPathsObject);
    });

    it('should not a affect the paths object', () => {
      const originalPathsObject = {
        'Ceci.est.un.test.pouet.0.a': 'tutu',
        'Ceci.est.un.test.Miyazaki.b': '89',
        'Ceci.est.un.test.toto.c': 'LesLapinsCretins',
      };

      // When
      service.lowerCaseFirstCharForProps(pathsObject, ['toto']);

      // Then
      expect(pathsObject).toStrictEqual(originalPathsObject);
    });
  });

  describe('upperCaseFirstCharForProps', () => {
    const pathsObject = {
      'Ceci.est.un.test.Miyazaki.b': '89',
      'Ceci.est.un.test.pouet.0.a': 'tutu',
      'Ceci.est.un.test.toto.c': 'lesLapinsCretins',
    };

    it('should call forEachPath to iter over paths', () => {
      // Given
      service.forEachPath = jest.fn();

      // When
      service.upperCaseFirstCharForProps(pathsObject, ['toto']);

      // Then
      expect(service.forEachPath).toHaveBeenCalledTimes(1);
      expect(service.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        expect.any(Function),
      );
    });

    it('should prefix values for paths that match the given props', () => {
      // Given
      const expectedPathsObject = {
        'Ceci.est.un.test.Miyazaki.b': '89',
        'Ceci.est.un.test.pouet.0.a': 'tutu',
        'Ceci.est.un.test.toto.c': 'LesLapinsCretins',
      };

      // When
      const result = service.upperCaseFirstCharForProps(pathsObject, ['toto']);

      // Then
      expect(result).toStrictEqual(expectedPathsObject);
    });

    it('should not a affect the paths object', () => {
      const originalPathsObject = {
        'Ceci.est.un.test.pouet.0.a': 'tutu',
        'Ceci.est.un.test.Miyazaki.b': '89',
        'Ceci.est.un.test.toto.c': 'lesLapinsCretins',
      };

      // When
      service.upperCaseFirstCharForProps(pathsObject, ['toto']);

      // Then
      expect(pathsObject).toStrictEqual(originalPathsObject);
    });
  });

  describe('pathsObjectToJson', () => {
    const pathsObject = {
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Hitori.Botchi': 'Whipser',
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Osorezuni.Ikiyou': 'Of',
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.0.Yume': 'The',
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.1.Miteta': 'Heart',
    };

    it('it should call forEachPath with the paths object and a callback', () => {
      // Given
      service.forEachPath = jest.fn();
      // When
      service.pathsObjectToJson(pathsObject);

      // Then
      expect(service.forEachPath).toHaveBeenCalledTimes(1);
      expect(service.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        expect.any(Function),
      );
    });

    it('it should build a complex object from the pathsObject', () => {
      // Given
      const expectedJson = {
        Hitori: {
          Botchi: {
            Osorezuni: {
              Ikiyou: {
                To: {
                  Yume: {
                    Miteta: {
                      Hitori: { Botchi: 'Whipser' },
                      Osorezuni: { Ikiyou: 'Of' },
                      To: [{ Yume: 'The' }, { Miteta: 'Heart' }],
                    },
                  },
                },
              },
            },
          },
        },
      };

      // When
      const result = service.pathsObjectToJson(pathsObject);

      // Then
      expect(result).toStrictEqual(expectedJson);
    });

    it('should not a affect the paths object', () => {
      const originalPathsObject = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Hitori.Botchi':
          'Whipser',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Osorezuni.Ikiyou': 'Of',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.0.Yume': 'The',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.1.Miteta': 'Heart',
      };

      // When
      service.upperCaseFirstCharForProps(pathsObject, ['toto']);

      // Then
      expect(pathsObject).toStrictEqual(originalPathsObject);
    });
  });

  describe('replaceInPaths', () => {
    // Given
    const pathsObject = {
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Hitori.Botchi': 'Whipser',
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Osorezuni.Ikiyou': 'Of',
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.0.Yume': 'The',
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.1.Miteta': 'Heart',
    };

    it('it should call forEachPath with the paths object and a callback', () => {
      // Given
      service.forEachPath = jest.fn();

      // When
      service.replaceInPaths(pathsObject);

      // Then
      expect(service.forEachPath).toHaveBeenCalledTimes(1);
      expect(service.forEachPath).toHaveBeenCalledWith(
        pathsObject,
        expect.any(Function),
      );
    });

    it('it should replace "Miteta" by "Tartempion"', () => {
      // Given
      const expectedJson = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Tartempion.Hitori.Botchi':
          'Whipser',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Tartempion.Osorezuni.Ikiyou':
          'Of',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Tartempion.To.0.Yume': 'The',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Tartempion.To.1.Miteta':
          'Heart',
      };

      // When
      const result = service.replaceInPaths(
        pathsObject,
        'Miteta',
        'Tartempion',
      );

      // Then
      expect(result).toStrictEqual(expectedJson);
    });

    it('it should replace anything that match "/Miteta\\.(.*?)\\./" by "$1.Tartempion."', () => {
      // Given
      const expectedJson = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Hitori.Tartempion.Botchi':
          'Whipser',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Osorezuni.Tartempion.Ikiyou':
          'Of',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.To.Tartempion.0.Yume': 'The',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.To.Tartempion.1.Miteta':
          'Heart',
      };

      // When
      const result = service.replaceInPaths(
        pathsObject,
        /Miteta\.(.*?)\./,
        '$1.Tartempion.',
      );

      // Then
      expect(result).toStrictEqual(expectedJson);
    });

    it('should not a affect the paths object', () => {
      const originalPathsObject = {
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Hitori.Botchi':
          'Whipser',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Osorezuni.Ikiyou': 'Of',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.0.Yume': 'The',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.1.Miteta': 'Heart',
      };

      // When
      service.upperCaseFirstCharForProps(pathsObject, ['toto']);

      // Then
      expect(pathsObject).toStrictEqual(originalPathsObject);
    });
  });

  describe('forEachPath', () => {
    const pathsObject = {
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Hitori.Botchi': 'Whipser',
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Osorezuni.Ikiyou': 'Of',
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.0.Yume': 'The',
      'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.1.Miteta': 'Heart',
    };

    it('it should call the callback function with each path and values from the paths object', () => {
      // Given
      const cb = jest.fn();
      const expectedKeys = [
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Hitori.Botchi',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Osorezuni.Ikiyou',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.0.Yume',
        'Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.1.Miteta',
      ];
      const expectedValues = ['Whipser', 'Of', 'The', 'Heart'];

      // When
      service.forEachPath(pathsObject, cb);

      // Then
      expect(cb).toHaveBeenCalledTimes(4);
      expect(cb).toHaveBeenNthCalledWith(1, expectedKeys[0], expectedValues[0]);
      expect(cb).toHaveBeenNthCalledWith(2, expectedKeys[1], expectedValues[1]);
      expect(cb).toHaveBeenNthCalledWith(3, expectedKeys[2], expectedValues[2]);
      expect(cb).toHaveBeenNthCalledWith(4, expectedKeys[3], expectedValues[3]);
    });

    it('should return an empty object if the callback returns undefined', () => {
      // Given
      const cb = () => undefined;

      // When
      const result = service.forEachPath(pathsObject, cb);

      // Then
      expect(result).toStrictEqual({});
    });

    it('should return an empty object if the callback returns an empty array', () => {
      // Given
      const cb = () => [];

      // When
      const result = service.forEachPath(pathsObject, cb);

      // Then
      expect(result).toStrictEqual({});
    });

    it('should return as key/value whatever the callback returns as array of arrays', () => {
      // Given
      const cb = (key, value) => [
        [`Miyazaki.${key}`, `Miyazaki.${value}`],
        [`NotDisney.${key}`, `NotDisney.${value}`],
      ];
      const expectedPathsObject = {
        'Miyazaki.Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Hitori.Botchi':
          'Miyazaki.Whipser',
        'Miyazaki.Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Osorezuni.Ikiyou':
          'Miyazaki.Of',
        'Miyazaki.Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.0.Yume':
          'Miyazaki.The',
        'Miyazaki.Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.1.Miteta':
          'Miyazaki.Heart',
        'NotDisney.Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Hitori.Botchi':
          'NotDisney.Whipser',
        'NotDisney.Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.Osorezuni.Ikiyou':
          'NotDisney.Of',
        'NotDisney.Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.0.Yume':
          'NotDisney.The',
        'NotDisney.Hitori.Botchi.Osorezuni.Ikiyou.To.Yume.Miteta.To.1.Miteta':
          'NotDisney.Heart',
      };

      // When
      const result = service.forEachPath(pathsObject, cb);

      // Then
      expect(result).toStrictEqual(expectedPathsObject);
    });

    it('should return an empty object if the callback returns an array containing another one but with no newKeyPath and no newValue', () => {
      // Given
      const cb = () => [[]];

      // When
      const result = service.forEachPath(pathsObject, cb);

      // Then
      expect(result).toStrictEqual({});
    });

    it('should not iter on non enumerable properties to prevent prototype pollution', () => {
      // Given
      function TryInjection() {
        this.okToIter = 42;
        return;
      }
      TryInjection.prototype.notOkToIter = 21;

      const pathsObjectWithPrototype = new TryInjection();

      const cb = jest.fn();

      // When
      service.forEachPath(pathsObjectWithPrototype, cb);

      // Then
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveBeenCalledWith('okToIter', 42);
      expect(cb).not.toHaveBeenCalledWith('notOkToIter', 21);
    });
  });

  describe('addFailureStatus', () => {
    it('should add the node failure with false value if statusCode is Success', () => {
      // Given
      const pathsObject = {
        'lightResponse.status.statusCode': 'Success',
      };

      // When
      const result = service.addFailureStatus(pathsObject);

      // Then
      expect(result).toStrictEqual({
        'lightResponse.status.failure': 'false',
        'lightResponse.status.statusCode': 'Success',
      });
    });

    it('should add the node failure with true value if statusCode is Error', () => {
      // Given
      const pathsObject = {
        'lightResponse.status.statusCode': 'Error',
      };

      // When
      const result = service.addFailureStatus(pathsObject);

      // Then
      expect(result).toStrictEqual({
        'lightResponse.status.failure': 'true',
        'lightResponse.status.statusCode': 'Error',
      });
    });

    it('should overirde the node failure with true value if statusCode is Error and failure at false', () => {
      // Given
      const pathsObject = {
        'lightResponse.status.statusCode': 'Error',
        'lightResponse.status.failure': 'false',
      };

      // When
      const result = service.addFailureStatus(pathsObject);

      // Then
      expect(result).toStrictEqual({
        'lightResponse.status.failure': 'true',
        'lightResponse.status.statusCode': 'Error',
      });
    });
  });
});
