import { Test, TestingModule } from '@nestjs/testing';

import { DcqlQuery } from '@mocks/dcql';

import { DcqlCredentialFormat } from '../enums';
import {
  DcqlInvalidMdocPathException,
  DcqlInvalidQueryException,
} from '../exceptions';
import {
  extractClaimNames,
  parseMdocJsonPath,
  toFcDcqlQuery,
} from '../helpers';
import {
  BuildMdocDcqlQueryInputInterface,
  DcqlQueryInterface,
} from '../interfaces';
import { DcqlService } from './dcql.service';

jest.mock('../helpers', () => ({
  extractClaimNames: jest.fn(),
  parseMdocJsonPath: jest.fn(),
  toFcDcqlQuery: jest.fn(),
}));

describe('DcqlService', () => {
  let service: DcqlService;

  const dcqlQueryParseMock = jest.mocked(DcqlQuery.parse);
  const dcqlQueryValidateMock = jest.mocked(DcqlQuery.validate);
  const parseMdocJsonPathMock = jest.mocked(parseMdocJsonPath);
  const toFcDcqlQueryMock = jest.mocked(toFcDcqlQuery);
  const extractClaimNamesMock = jest.mocked(extractClaimNames);

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DcqlService],
    }).compile();

    service = module.get<DcqlService>(DcqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildMdocQuery', () => {
    const input: BuildMdocDcqlQueryInputInterface = {
      id: 'pid-fc',
      doctype: 'eu.europa.ec.eudi.pid.1',
      requiredPaths: ["$['eu.europa.ec.eudi.pid.1']['family_name']"],
      optionalPaths: [],
      intentToRetain: false,
    };
    const rawQuery = { credentials: [] };
    const parsedQuery = { credentials: [{ id: 'pid-fc', format: 'mso_mdoc' }] };

    beforeEach(() => {
      service['buildRawMdocQuery'] = jest.fn().mockReturnValue(rawQuery);
      service.parse = jest.fn().mockReturnValue(parsedQuery);
    });

    it('should build the raw query from the input', () => {
      // When
      service.buildMdocQuery(input);

      // Then
      expect(service['buildRawMdocQuery']).toHaveBeenCalledExactlyOnceWith(
        input,
      );
    });

    it('should parse the raw query', () => {
      // When
      service.buildMdocQuery(input);

      // Then
      expect(service.parse).toHaveBeenCalledExactlyOnceWith(rawQuery);
    });

    it('should return the parsed query', () => {
      // When
      const result = service.buildMdocQuery(input);

      // Then
      expect(result).toBe(parsedQuery);
    });
  });

  describe('parse', () => {
    const input = { credentials: [{ id: 'pid-fc', format: 'mso_mdoc' }] };
    const parsed = { credentials: [{ id: 'pid-fc', format: 'mso_mdoc' }] };
    const mapped: DcqlQueryInterface = {
      credentials: [{ id: 'pid-fc', format: 'mso_mdoc' }],
    };

    it('should parse the input with the npm dcql library', () => {
      // Given
      dcqlQueryParseMock.mockReturnValue(parsed as never);
      toFcDcqlQueryMock.mockReturnValue(mapped);

      // When
      service.parse(input);

      // Then
      expect(dcqlQueryParseMock).toHaveBeenCalledExactlyOnceWith(input);
    });

    it('should validate the parsed query', () => {
      // Given
      dcqlQueryParseMock.mockReturnValue(parsed as never);
      toFcDcqlQueryMock.mockReturnValue(mapped);

      // When
      service.parse(input);

      // Then
      expect(dcqlQueryValidateMock).toHaveBeenCalledExactlyOnceWith(parsed);
    });

    it('should map the parsed query to FC types', () => {
      // Given
      dcqlQueryParseMock.mockReturnValue(parsed as never);
      toFcDcqlQueryMock.mockReturnValue(mapped);

      // When
      service.parse(input);

      // Then
      expect(toFcDcqlQueryMock).toHaveBeenCalledExactlyOnceWith(parsed);
    });

    it('should return the mapped query', () => {
      // Given
      dcqlQueryParseMock.mockReturnValue(parsed as never);
      toFcDcqlQueryMock.mockReturnValue(mapped);

      // When
      const result = service.parse(input);

      // Then
      expect(result).toBe(mapped);
    });

    it('should wrap a parse error', () => {
      // Given
      const parseError = new Error('parse failed');
      const wrapped = new DcqlInvalidQueryException(parseError);
      dcqlQueryParseMock.mockImplementation(() => {
        throw parseError;
      });
      service['wrapParseError'] = jest.fn().mockReturnValue(wrapped);

      // When / Then
      expect(() => service.parse(input)).toThrow(wrapped);
      expect(service['wrapParseError']).toHaveBeenCalledExactlyOnceWith(
        parseError,
      );
    });

    it('should wrap a validate error', () => {
      // Given
      const validateError = new Error('validate failed');
      const wrapped = new DcqlInvalidQueryException(validateError);
      dcqlQueryParseMock.mockReturnValue(parsed as never);
      dcqlQueryValidateMock.mockImplementation(() => {
        throw validateError;
      });
      service['wrapParseError'] = jest.fn().mockReturnValue(wrapped);

      // When / Then
      expect(() => service.parse(input)).toThrow(wrapped);
      expect(service['wrapParseError']).toHaveBeenCalledExactlyOnceWith(
        validateError,
      );
    });
  });

  describe('extractClaimNames', () => {
    const query: DcqlQueryInterface = {
      credentials: [{ id: 'pid-fc', format: 'mso_mdoc' }],
    };

    it('should delegate to the extractClaimNames helper', () => {
      // When
      service.extractClaimNames(query);

      // Then
      expect(extractClaimNamesMock).toHaveBeenCalledExactlyOnceWith(query);
    });

    it('should return the helper result', () => {
      // Given
      const names = ['family_name'];
      extractClaimNamesMock.mockReturnValue(names);

      // When
      const result = service.extractClaimNames(query);

      // Then
      expect(result).toBe(names);
    });
  });

  describe('buildRawMdocQuery', () => {
    const input: BuildMdocDcqlQueryInputInterface = {
      id: 'pid-fc',
      doctype: 'eu.europa.ec.eudi.pid.1',
      requiredPaths: ["$['eu.europa.ec.eudi.pid.1']['family_name']"],
      optionalPaths: [],
      intentToRetain: false,
    };
    const claims = [
      {
        id: 'family_name',
        path: ['eu.europa.ec.eudi.pid.1', 'family_name'],
        intent_to_retain: false,
      },
    ];

    beforeEach(() => {
      service['toClaimIds'] = jest
        .fn()
        .mockReturnValueOnce(['family_name'])
        .mockReturnValueOnce([]);
      service['buildMdocClaims'] = jest.fn().mockReturnValue(claims);
    });

    it('should compute the claim ids of the required then optional paths', () => {
      // When
      service['buildRawMdocQuery'](input);

      // Then
      expect(service['toClaimIds']).toHaveBeenNthCalledWith(
        1,
        input.requiredPaths,
      );
      expect(service['toClaimIds']).toHaveBeenNthCalledWith(
        2,
        input.optionalPaths,
      );
    });

    it('should build the claims from the input', () => {
      // When
      service['buildRawMdocQuery'](input);

      // Then
      expect(service['buildMdocClaims']).toHaveBeenCalledExactlyOnceWith(input);
    });

    it('should build an mso_mdoc credential query without claim_sets when no optional paths', () => {
      // When
      const result = service['buildRawMdocQuery'](input);

      // Then
      expect(result).toEqual({
        credentials: [
          {
            id: 'pid-fc',
            format: DcqlCredentialFormat.MSO_MDOC,
            meta: { doctype_value: 'eu.europa.ec.eudi.pid.1' },
            claims,
          },
        ],
      });
    });

    it('should attach claim_sets to the credential when optional paths are provided', () => {
      // Given
      service['toClaimIds'] = jest
        .fn()
        .mockReturnValueOnce(['family_name'])
        .mockReturnValueOnce(['email_address']);

      // When
      const result = service['buildRawMdocQuery'](input);

      // Then
      expect(result.credentials[0].claim_sets).toEqual([
        ['family_name', 'email_address'],
        ['family_name'],
      ]);
    });

    it('should not repeat in the optional ids a claim already required', () => {
      // Given
      service['toClaimIds'] = jest
        .fn()
        .mockReturnValueOnce(['family_name'])
        .mockReturnValueOnce(['family_name', 'email_address']);

      // When
      const result = service['buildRawMdocQuery'](input);

      // Then
      expect(result.credentials[0].claim_sets).toEqual([
        ['family_name', 'email_address'],
        ['family_name'],
      ]);
    });
  });

  describe('buildMdocClaims', () => {
    const input: BuildMdocDcqlQueryInputInterface = {
      id: 'pid-fc',
      doctype: 'eu.europa.ec.eudi.pid.1',
      requiredPaths: [
        "$['eu.europa.ec.eudi.pid.1']['family_name']",
        "$['eu.europa.ec.eudi.pid.1']['given_name']",
      ],
      optionalPaths: [],
      intentToRetain: false,
    };

    beforeEach(() => {
      parseMdocJsonPathMock
        .mockReturnValueOnce(['eu.europa.ec.eudi.pid.1', 'family_name'])
        .mockReturnValueOnce(['eu.europa.ec.eudi.pid.1', 'given_name']);
      service['toClaimId'] = jest
        .fn()
        .mockImplementation(([, claim]: [string, string]) => claim);
    });

    it('should parse every required JSONPath', () => {
      // When
      service['buildMdocClaims'](input);

      // Then
      expect(parseMdocJsonPathMock).toHaveBeenNthCalledWith(
        1,
        input.requiredPaths[0],
      );
      expect(parseMdocJsonPathMock).toHaveBeenNthCalledWith(
        2,
        input.requiredPaths[1],
      );
    });

    it('should also parse optional JSONPaths when provided', () => {
      // Given
      parseMdocJsonPathMock
        .mockReset()
        .mockReturnValueOnce(['eu.europa.ec.eudi.pid.1', 'family_name'])
        .mockReturnValueOnce(['eu.europa.ec.eudi.pid.1', 'email_address']);
      const inputWithOptional: BuildMdocDcqlQueryInputInterface = {
        ...input,
        requiredPaths: ["$['eu.europa.ec.eudi.pid.1']['family_name']"],
        optionalPaths: ["$['eu.europa.ec.eudi.pid.1']['email_address']"],
      };

      // When
      service['buildMdocClaims'](inputWithOptional);

      // Then
      expect(parseMdocJsonPathMock).toHaveBeenNthCalledWith(
        1,
        inputWithOptional.requiredPaths[0],
      );
      expect(parseMdocJsonPathMock).toHaveBeenNthCalledWith(
        2,
        inputWithOptional.optionalPaths[0],
      );
    });

    it('should derive each claim id from its full path', () => {
      // When
      service['buildMdocClaims'](input);

      // Then
      expect(service['toClaimId']).toHaveBeenNthCalledWith(1, [
        'eu.europa.ec.eudi.pid.1',
        'family_name',
      ]);
      expect(service['toClaimId']).toHaveBeenNthCalledWith(2, [
        'eu.europa.ec.eudi.pid.1',
        'given_name',
      ]);
    });

    it('should build one claim query per path, carrying id and intent_to_retain', () => {
      // When
      const result = service['buildMdocClaims'](input);

      // Then
      expect(result).toEqual([
        {
          id: 'family_name',
          path: ['eu.europa.ec.eudi.pid.1', 'family_name'],
          intent_to_retain: false,
        },
        {
          id: 'given_name',
          path: ['eu.europa.ec.eudi.pid.1', 'given_name'],
          intent_to_retain: false,
        },
      ]);
    });

    it('should not point twice at the same claim', () => {
      // Given
      parseMdocJsonPathMock
        .mockReset()
        .mockReturnValue(['eu.europa.ec.eudi.pid.1', 'family_name']);

      // When
      const result = service['buildMdocClaims']({
        ...input,
        requiredPaths: [
          "$['eu.europa.ec.eudi.pid.1']['family_name']",
          "$['eu.europa.ec.eudi.pid.1']['family_name']",
        ],
      });

      // Then
      expect(result).toEqual([
        {
          id: 'family_name',
          path: ['eu.europa.ec.eudi.pid.1', 'family_name'],
          intent_to_retain: false,
        },
      ]);
    });
  });

  describe('toClaimIds', () => {
    const jsonPaths = [
      "$['eu.europa.ec.eudi.pid.1']['family_name']",
      "$['eu.europa.ec.eudi.pid.1']['given_name']",
    ];

    beforeEach(() => {
      parseMdocJsonPathMock
        .mockReturnValueOnce(['eu.europa.ec.eudi.pid.1', 'family_name'])
        .mockReturnValueOnce(['eu.europa.ec.eudi.pid.1', 'given_name']);
      service['toClaimId'] = jest
        .fn()
        .mockReturnValueOnce('family_name_id')
        .mockReturnValueOnce('given_name_id');
    });

    it('should parse every JSONPath', () => {
      // When
      service['toClaimIds'](jsonPaths);

      // Then
      expect(parseMdocJsonPathMock).toHaveBeenNthCalledWith(1, jsonPaths[0]);
      expect(parseMdocJsonPathMock).toHaveBeenNthCalledWith(2, jsonPaths[1]);
    });

    it('should derive the claim id of each parsed path', () => {
      // When
      service['toClaimIds'](jsonPaths);

      // Then
      expect(service['toClaimId']).toHaveBeenNthCalledWith(1, [
        'eu.europa.ec.eudi.pid.1',
        'family_name',
      ]);
      expect(service['toClaimId']).toHaveBeenNthCalledWith(2, [
        'eu.europa.ec.eudi.pid.1',
        'given_name',
      ]);
    });

    it('should return the claim ids in order', () => {
      // When
      const result = service['toClaimIds'](jsonPaths);

      // Then
      expect(result).toEqual(['family_name_id', 'given_name_id']);
    });

    it('should not return the same claim id twice', () => {
      // Given
      service['toClaimId'] = jest.fn().mockReturnValue('family_name_id');

      // When
      const result = service['toClaimIds'](jsonPaths);

      // Then
      expect(result).toEqual(['family_name_id']);
    });
  });

  describe('toClaimId', () => {
    it('should join namespace and claim, replacing characters outside the DCQL charset', () => {
      // When
      const result = service['toClaimId']([
        'eu.europa.ec.eudi.pid.1',
        'given_name',
      ]);

      // Then
      expect(result).toBe('eu_europa_ec_eudi_pid_1_given_name');
    });

    it('should give distinct ids to the same claim in two namespaces', () => {
      // When
      const pidId = service['toClaimId']([
        'eu.europa.ec.eudi.pid.1',
        'given_name',
      ]);
      const mdlId = service['toClaimId'](['org.iso.18013.5.1', 'given_name']);

      // Then
      expect(pidId).not.toBe(mdlId);
    });
  });

  describe('buildClaimSets', () => {
    const requiredIds = ['family_name', 'given_name'];

    it('should return undefined when there are no optional ids', () => {
      // When / Then
      expect(service['buildClaimSets'](requiredIds, [])).toBeUndefined();
    });

    it('should return required-only set as last entry', () => {
      // When
      const result = service['buildClaimSets'](requiredIds, ['email_address']);

      // Then
      expect(result![result!.length - 1]).toEqual([
        'family_name',
        'given_name',
      ]);
    });

    it('should generate cumulative sets for each optional id, most complete first', () => {
      // When
      const result = service['buildClaimSets'](requiredIds, [
        'email_address',
        'sex',
        'nationality',
      ]);

      // Then
      expect(result).toEqual([
        ['family_name', 'given_name', 'email_address', 'sex', 'nationality'],
        ['family_name', 'given_name', 'email_address', 'sex'],
        ['family_name', 'given_name', 'email_address', 'nationality'],
        ['family_name', 'given_name', 'sex', 'nationality'],
        ['family_name', 'given_name', 'email_address'],
        ['family_name', 'given_name', 'sex'],
        ['family_name', 'given_name', 'nationality'],
        ['family_name', 'given_name'],
      ]);
    });
  });

  describe('wrapParseError', () => {
    it('should return the same exception when it is already a DcqlBaseException', () => {
      // Given
      const error = new DcqlInvalidMdocPathException('$.x');

      // When
      const result = service['wrapParseError'](error);

      // Then
      expect(result).toBe(error);
    });

    it('should wrap an Error into DcqlInvalidQueryException', () => {
      // Given
      const cause = new Error('boom');

      // When
      const result = service['wrapParseError'](cause);

      // Then
      expect(result).toBeInstanceOf(DcqlInvalidQueryException);
      expect(result.originalError).toBe(cause);
    });

    it('should wrap a non-Error value with the default message', () => {
      // When
      const result = service['wrapParseError']('nope');

      // Then
      expect(result).toBeInstanceOf(DcqlInvalidQueryException);
    });
  });
});
