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
      ];

      jest.spyOn(console, 'log').mockImplementation(() => {});

      MarkdownGenerator.checkForDuplicatedCodes(
        errors as unknown as ExceptionDocumentationInterface[],
      );

      /**
       * @todo #1988 Fix inconsistent usage of codes and scopes across the codebase
       *
       * UT for throwing code:
       *
       * expect(() => MarkdownGenerator.checkForDuplicatedCodes(errors)).toThrow(
       *    'Error code Y0101 is duplicated',
       *  );
       *
       * UT for temporary behavior (just log error):
       */
      expect(console.log).toHaveBeenCalledWith(
        'Error code Y0101 is duplicated',
      );
    });
  });
});
