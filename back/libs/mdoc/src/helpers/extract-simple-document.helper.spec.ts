import {
  MdocDocumentInterface,
  MdocDocumentTypeNotFoundException,
} from '@fc/mdoc';

import {
  extractClaims,
  extractSimpleDocument,
  getDocumentByType,
} from './extract-simple-document.helper';

describe('extract-simple-document.helper', () => {
  describe('extractSimpleDocument', () => {
    const docType = 'PID';
    const items = [
      { digestID: 1, elementIdentifier: 'family_name', elementValue: 'DUPONT' },
      { digestID: 2, elementIdentifier: 'given_name', elementValue: 'JEAN' },
    ];
    const nameSpaces = new Map<string, typeof items>([
      ['eu.europa.ec.eudi.pid.1', items],
    ]);
    const document = {
      docType,
      issuerSigned: { nameSpaces },
    } as unknown as MdocDocumentInterface;
    const documents = [document];

    it('should throw MdocDocumentTypeNotFoundException when no document matches the given docType', () => {
      // Then / When
      expect(() => extractSimpleDocument([], docType)).toThrow(
        MdocDocumentTypeNotFoundException,
      );
    });

    it('should return the simple document with docType and claims', () => {
      // When
      const result = extractSimpleDocument(documents, docType);

      // Then
      expect(result).toEqual({
        docType,
        claims: {
          'eu.europa.ec.eudi.pid.1': {
            family_name: 'DUPONT',
            given_name: 'JEAN',
          },
        },
      });
    });

    it('should return empty claims when nameSpaces is empty', () => {
      // Given
      const emptyDocument = {
        docType,
        issuerSigned: { nameSpaces: new Map() },
      } as unknown as MdocDocumentInterface;

      // When
      const result = extractSimpleDocument([emptyDocument], docType);

      // Then
      expect(result).toEqual({
        docType,
        claims: {},
      });
    });

    it('should aggregate claims for multiple namespaces', () => {
      // Given
      const multipleNameSpaces = new Map<string, typeof items>([
        [
          'namespace-1',
          [
            {
              digestID: 1,
              elementIdentifier: 'family_name',
              elementValue: 'DUPONT',
            },
          ],
        ],
        [
          'namespace-2',
          [
            {
              digestID: 2,
              elementIdentifier: 'given_name',
              elementValue: 'JEAN',
            },
          ],
        ],
      ]);
      const multiNamespaceDocument = {
        docType,
        issuerSigned: { nameSpaces: multipleNameSpaces },
      } as unknown as MdocDocumentInterface;

      // When
      const result = extractSimpleDocument([multiNamespaceDocument], docType);

      // Then
      expect(result).toEqual({
        docType,
        claims: {
          'namespace-1': { family_name: 'DUPONT' },
          'namespace-2': { given_name: 'JEAN' },
        },
      });
    });

    it('should throw when no document matches the given docType', () => {
      // Then / When
      expect(() => extractSimpleDocument([], docType)).toThrow();
    });
  });

  describe('extractClaims', () => {
    it('should reduce items to a claims record', () => {
      // Given
      const items = [
        {
          digestID: 1,
          elementIdentifier: 'family_name',
          elementValue: 'DUPONT',
        },
        {
          digestID: 2,
          elementIdentifier: 'given_name',
          elementValue: 'JEAN',
        },
      ];

      // When
      const result = extractClaims(items);

      // Then
      expect(result).toEqual({
        family_name: 'DUPONT',
        given_name: 'JEAN',
      });
    });

    it('should ignore items without elementIdentifier', () => {
      // Given
      const items = [
        {
          digestID: 1,
          elementIdentifier: 'family_name',
          elementValue: 'DUPONT',
        },
        {
          digestID: 2,
          elementIdentifier: '',
          elementValue: 'ignored',
        },
        {
          digestID: 3,
          elementIdentifier: undefined as unknown as string,
          elementValue: 'ignored',
        },
      ];

      // When
      const result = extractClaims(items);

      // Then
      expect(result).toEqual({
        family_name: 'DUPONT',
      });
    });

    it('should return an empty object when items is empty', () => {
      // When
      const result = extractClaims([]);

      // Then
      expect(result).toEqual({});
    });

    it('should keep the last value when elementIdentifier is duplicated', () => {
      // Given
      const items = [
        {
          digestID: 1,
          elementIdentifier: 'family_name',
          elementValue: 'DUPONT',
        },
        {
          digestID: 2,
          elementIdentifier: 'family_name',
          elementValue: 'MARTIN',
        },
      ];

      // When
      const result = extractClaims(items);

      // Then
      expect(result).toEqual({
        family_name: 'MARTIN',
      });
    });
  });

  describe('getDocumentByType', () => {
    const pidDocument = {
      docType: 'PID',
    } as unknown as MdocDocumentInterface;
    const otherDocument = {
      docType: 'org.iso.18013.5.1.mDL',
    } as unknown as MdocDocumentInterface;

    it('should return the document matching the given docType', () => {
      // Given
      const documents = [otherDocument, pidDocument];

      // When
      const result = getDocumentByType(documents, 'PID');

      // Then
      expect(result).toBe(pidDocument);
    });

    it('should return undefined when no document matches the given docType', () => {
      // Given
      const documents = [otherDocument];

      // When
      const result = getDocumentByType(documents, 'PID');

      // Then
      expect(result).toBeUndefined();
    });

    it('should return undefined when documents list is empty', () => {
      // When
      const result = getDocumentByType([], 'PID');

      // Then
      expect(result).toBeUndefined();
    });
  });
});
