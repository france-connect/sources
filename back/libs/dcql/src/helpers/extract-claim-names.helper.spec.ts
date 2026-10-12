import { DcqlClaimQueryInterface, DcqlQueryInterface } from '../interfaces';
import {
  extractClaimName,
  extractClaimNames,
} from './extract-claim-names.helper';

describe('extractClaimNames', () => {
  it('should extract unique claim names from credential claims paths', () => {
    // Given
    const query: DcqlQueryInterface = {
      credentials: [
        {
          id: 'pid-fc',
          format: 'mso_mdoc',
          claims: [
            { path: ['eu.europa.ec.eudi.pid.1', 'family_name'] },
            { path: ['eu.europa.ec.eudi.pid.1', 'given_name'] },
            { path: ['eu.europa.ec.eudi.pid.1', 'family_name'] },
          ],
        },
      ],
    };

    // When
    const result = extractClaimNames(query);

    // Then
    expect(result).toEqual(['family_name', 'given_name']);
  });

  it('should collect claims from every credential', () => {
    // Given
    const query: DcqlQueryInterface = {
      credentials: [
        {
          id: 'first',
          format: 'mso_mdoc',
          claims: [{ path: ['ns', 'family_name'] }],
        },
        {
          id: 'second',
          format: 'mso_mdoc',
          claims: [{ path: ['ns', 'given_name'] }],
        },
      ],
    };

    // When
    const result = extractClaimNames(query);

    // Then
    expect(result).toEqual(['family_name', 'given_name']);
  });

  it('should return an empty array when no credential has claims', () => {
    // Given
    const query: DcqlQueryInterface = {
      credentials: [{ id: 'pid-fc', format: 'mso_mdoc' }],
    };

    // When
    const result = extractClaimNames(query);

    // Then
    expect(result).toEqual([]);
  });

  it('should skip claims without an extractable name', () => {
    // Given
    const query: DcqlQueryInterface = {
      credentials: [
        {
          id: 'pid-fc',
          format: 'mso_mdoc',
          claims: [{ path: [] }, { path: ['eu.europa.ec.eudi.pid.1', 'sex'] }],
        },
      ],
    };

    // When
    const result = extractClaimNames(query);

    // Then
    expect(result).toEqual(['sex']);
  });
});

describe('extractClaimName', () => {
  it('should return the last path segment for an mdoc claims path pointer', () => {
    // Given
    const claim: DcqlClaimQueryInterface = {
      path: ['eu.europa.ec.eudi.pid.1', 'given_name'],
    };

    // When
    const result = extractClaimName(claim);

    // Then
    expect(result).toBe('given_name');
  });

  it('should return undefined when the last path segment is not a string', () => {
    // Given
    const claim: DcqlClaimQueryInterface = { path: ['ns', 0] };

    // When
    const result = extractClaimName(claim);

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined when the path is absent', () => {
    // When
    const result = extractClaimName({});

    // Then
    expect(result).toBeUndefined();
  });
});
