import { ExceptionDocumentationInterface } from '@fc/exceptions/types';

import MarkdownGenerator from './markdown-generator';

describe('MarkdownGenerator', () => {
  describe('MarkdownGenerator.removeExceptionsWithoutCode', () => {
    it('should remove any error without a code property', () => {
      const errs = [
        { CODE: 3 },
        {},
        { CODE: 2 },
      ] as ExceptionDocumentationInterface[];
      const result = errs.filter(MarkdownGenerator.removeExceptionsWithoutCode);
      const expected = [{ CODE: 3 }, { CODE: 2 }];
      expect(result).toStrictEqual(expected);
    });
  });

  describe('MarkdownGenerator.sortByCode', () => {
    it('should order errors by scope then by code properties', () => {
      const errs = [
        { CODE: 3, SCOPE: 2 },
        { CODE: 2, SCOPE: 1 },
        { CODE: 1, SCOPE: 1 },
      ] as ExceptionDocumentationInterface[];
      const result = errs.sort(MarkdownGenerator.sortByCode);
      const expected = [
        { CODE: 1, SCOPE: 1 },
        { CODE: 2, SCOPE: 1 },
        { CODE: 3, SCOPE: 2 },
      ];
      expect(result).toStrictEqual(expected);
    });
  });

  describe('MarkdownGenerator.groupExceptionsByScope', () => {
    it('should group exceptions with the same scope property', () => {
      const errs = [
        { SCOPE: 3, UI: '3.1' },
        { SCOPE: 3, UI: '3.2' },
        { SCOPE: 2, UI: '2.1' },
      ];
      const result = errs.reduce(MarkdownGenerator.groupExceptionsByScope, {});
      const expected = {
        3: [
          { SCOPE: 3, UI: '3.1' },
          { SCOPE: 3, UI: '3.2' },
        ],
        2: [{ SCOPE: 2, UI: '2.1' }],
      };
      expect(result).toStrictEqual(expected);
    });
  });

  describe('MarkdownGenerator.generate', () => {
    it('should generate a markdown document from a stack of errors', () => {
      const errors = [
        {
          errorCode: 'Y0101',
          SCOPE: 1,
          CODE: 1,
          UI: 'any',
          description: 'any',
          trackable: false,
          loggable: false,
          path: 'path/to/file.exception.ts',
          exception: 'notWorkingBuddy',
        },
        {
          errorCode: 'Y0201',
          SCOPE: 2,
          CODE: 1,
          UI: 'any',
          description: 'any',
          trackable: false,
          loggable: false,
          path: 'path/to/file.exception.ts',
          exception: 'notWorkingBuddy',
        },
      ];
      const result = MarkdownGenerator.generate(
        errors as unknown as ExceptionDocumentationInterface[],
      );
      const expected = [
        [
          {
            errorCode: 'Y0101',
            SCOPE: 1,
            CODE: 1,
            UI: 'any',
            description: 'any',
            trackable: false,
            loggable: false,
            path: 'path/to/file.exception.ts',
            exception: 'notWorkingBuddy',
          },
        ],
        [
          {
            errorCode: 'Y0201',
            SCOPE: 2,
            CODE: 1,
            UI: 'any',
            description: 'any',
            trackable: false,
            loggable: false,
            path: 'path/to/file.exception.ts',
            exception: 'notWorkingBuddy',
          },
        ],
      ];
      expect(result).toStrictEqual(expected);
    });
  });

  describe('MarkdownGenerator.checkForDuplicatedCodes', () => {
    it('should throw an error if there are duplicated error codes', () => {
      const errors = [
        { errorCode: 'Y0101' },
        { errorCode: 'Y0101' },
        { errorCode: 'Y0201' },
      ] as unknown as ExceptionDocumentationInterface[];

      expect(() => MarkdownGenerator.checkForDuplicatedCodes(errors)).toThrow(
        'Error code Y0101 is duplicated',
      );
    });
  });

  describe('MardownGenerator.checkForPathInconsistency', () => {
    it('should throw an error if there is an inconsistency in the path property', () => {
      const errors = [
        { SCOPE: 1, path: 'path1' },
        { SCOPE: 1, path: 'path2' },
      ] as unknown as ExceptionDocumentationInterface[];

      expect(() => MarkdownGenerator.checkForPathInconsistency(errors)).toThrow(
        'Path inconsistency in scope 1: path1 !== path2',
      );
    });

    it('should not throw an error if there is no inconsistency in the path property', () => {
      const errors = [
        { SCOPE: 1, path: 'path1' },
        { SCOPE: 1, path: 'path1' },
        { SCOPE: 2, path: 'path2' },
        { SCOPE: 2, path: 'path2' },
      ] as unknown as ExceptionDocumentationInterface[];

      expect(() =>
        MarkdownGenerator.checkForPathInconsistency(errors),
      ).not.toThrow();
    });
  });
});
