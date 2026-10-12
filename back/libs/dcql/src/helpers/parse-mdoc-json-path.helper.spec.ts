import { DcqlInvalidMdocPathException } from '../exceptions';
import { parseMdocJsonPath } from './parse-mdoc-json-path.helper';

describe('parseMdocJsonPath', () => {
  it('should return the namespace and claim name from an mdoc JSONPath', () => {
    // When
    const result = parseMdocJsonPath(
      "$['eu.europa.ec.eudi.pid.1']['family_name']",
    );

    // Then
    expect(result).toEqual(['eu.europa.ec.eudi.pid.1', 'family_name']);
  });

  it('should throw DcqlInvalidMdocPathException when the path is not an mdoc JSONPath', () => {
    // When / Then
    expect(() => parseMdocJsonPath('$.family_name')).toThrow(
      DcqlInvalidMdocPathException,
    );
  });

  it('should throw DcqlInvalidMdocPathException when a bracketed segment is missing', () => {
    // When / Then
    expect(() => parseMdocJsonPath("$['eu.europa.ec.eudi.pid.1']")).toThrow(
      DcqlInvalidMdocPathException,
    );
  });
});
