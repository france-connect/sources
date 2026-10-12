import {
  ParsedDcqlClaimInterface,
  ParsedDcqlCredentialInterface,
  ParsedDcqlCredentialSetInterface,
  ParsedDcqlQueryInterface,
} from '../interfaces';
import {
  toFcClaim,
  toFcCredential,
  toFcCredentialSet,
  toFcDcqlQuery,
} from './to-fc-dcql-query.helper';

describe('toFcDcqlQuery', () => {
  it('should map every credential of the parsed query', () => {
    // Given
    const parsed: ParsedDcqlQueryInterface = {
      credentials: [
        { id: 'first', format: 'mso_mdoc' },
        { id: 'second', format: 'mso_mdoc' },
      ],
    };

    // When
    const result = toFcDcqlQuery(parsed);

    // Then
    expect(result).toEqual({
      credentials: [
        { id: 'first', format: 'mso_mdoc' },
        { id: 'second', format: 'mso_mdoc' },
      ],
    });
  });

  it('should map every credential set when they are present', () => {
    // Given
    const parsed: ParsedDcqlQueryInterface = {
      credentials: [{ id: 'pid-fc', format: 'mso_mdoc' }],
      credential_sets: [{ options: [['pid-fc']] }],
    };

    // When
    const result = toFcDcqlQuery(parsed);

    // Then
    expect(result).toEqual({
      credentials: [{ id: 'pid-fc', format: 'mso_mdoc' }],
      credential_sets: [{ options: [['pid-fc']] }],
    });
  });
});

describe('toFcCredentialSet', () => {
  it('should copy the options', () => {
    // Given
    const credentialSet: ParsedDcqlCredentialSetInterface = {
      options: [['pid-fc']],
    };

    // When
    const result = toFcCredentialSet(credentialSet);

    // Then
    expect(result).toEqual({
      options: [['pid-fc']],
    });
  });
});

describe('toFcCredential', () => {
  it('should copy id and format', () => {
    // Given
    const credential: ParsedDcqlCredentialInterface = {
      id: 'pid-fc',
      format: 'mso_mdoc',
    };

    // When
    const result = toFcCredential(credential);

    // Then
    expect(result).toEqual({
      id: 'pid-fc',
      format: 'mso_mdoc',
    });
  });

  it('should copy meta when it is present', () => {
    // Given
    const credential: ParsedDcqlCredentialInterface = {
      id: 'pid-fc',
      format: 'mso_mdoc',
      meta: { doctype_value: 'eu.europa.ec.eudi.pid.1' },
    };

    // When
    const result = toFcCredential(credential);

    // Then
    expect(result).toEqual({
      id: 'pid-fc',
      format: 'mso_mdoc',
      meta: { doctype_value: 'eu.europa.ec.eudi.pid.1' },
    });
  });

  it('should map claims when they are present', () => {
    // Given
    const credential: ParsedDcqlCredentialInterface = {
      id: 'pid-fc',
      format: 'mso_mdoc',
      claims: [{ path: ['eu.europa.ec.eudi.pid.1', 'family_name'] }],
    };

    // When
    const result = toFcCredential(credential);

    // Then
    expect(result).toEqual({
      id: 'pid-fc',
      format: 'mso_mdoc',
      claims: [{ path: ['eu.europa.ec.eudi.pid.1', 'family_name'] }],
    });
  });
});

describe('toFcClaim', () => {
  it('should copy the path when it is present', () => {
    // Given
    const claim: ParsedDcqlClaimInterface = {
      path: ['eu.europa.ec.eudi.pid.1', 'family_name'],
    };

    // When
    const result = toFcClaim(claim);

    // Then
    expect(result).toEqual({
      path: ['eu.europa.ec.eudi.pid.1', 'family_name'],
    });
  });

  it('should copy intent_to_retain when it is present', () => {
    // Given
    const claim: ParsedDcqlClaimInterface = { intent_to_retain: false };

    // When
    const result = toFcClaim(claim);

    // Then
    expect(result).toEqual({ intent_to_retain: false });
  });

  it('should return an empty object when the claim has no mapped fields', () => {
    // When
    const result = toFcClaim({});

    // Then
    expect(result).toEqual({});
  });
});
