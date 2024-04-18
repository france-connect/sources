import MarkdownGenerator from './markdown-generator';

describe('MarkdownGenerator', () => {
  describe('MarkdownGenerator.removeExceptionsWithoutCode', () => {
    it('Should remove any error without a code property', () => {
      const errs = [{ code: 3 }, {}, { code: 2 }];
      const result = errs.filter(MarkdownGenerator.removeExceptionsWithoutCode);
      const expected = [{ code: 3 }, { code: 2 }];
      expect(result).toStrictEqual(expected);
    });
  });

  describe('MarkdownGenerator.sortByCode', () => {
    it('Should order errors by scope then by code properties', () => {
      const errs = [
        { code: 3, scope: 2 },
        { code: 2, scope: 1 },
        { code: 1, scope: 1 },
      ];
      const result = errs.sort(MarkdownGenerator.sortByCode);
      const expected = [
        { code: 1, scope: 1 },
        { code: 2, scope: 1 },
        { code: 3, scope: 2 },
      ];
      expect(result).toStrictEqual(expected);
    });
  });

  describe('MarkdownGenerator.groupExceptionsByScope', () => {
    it('Should group exceptions with the same scope property', () => {
      const errs = [
        { scope: 3, message: '3.1' },
        { scope: 3, message: '3.2' },
        { scope: 2, message: '2.1' },
      ];
      const result = errs.reduce(MarkdownGenerator.groupExceptionsByScope, {});
      const expected = {
        3: [
          { scope: 3, message: '3.1' },
          { scope: 3, message: '3.2' },
        ],
        2: [{ scope: 2, message: '2.1' }],
      };
      expect(result).toStrictEqual(expected);
    });
  });

  describe('MarkdownGenerator.generate', () => {
    it('Should generate a markdown document from a stack of errors', () => {
      const errors = [
        {
          errorCode: 'Y0101',
          scope: 1,
          code: 1,
          message: 'any',
          description: 'any',
          trackable: false,
          loggable: false,
          path: 'path/to/file.exception.ts',
          exception: 'notWorkingBuddy',
        },
        {
          errorCode: 'Y0201',
          scope: 2,
          code: 1,
          message: 'any',
          description: 'any',
          trackable: false,
          loggable: false,
          path: 'path/to/file.exception.ts',
          exception: 'notWorkingBuddy',
        },
      ];
      const result = MarkdownGenerator.generate(errors);
      const expected = [
        [
          {
            errorCode: 'Y0101',
            scope: 1,
            code: 1,
            message: 'any',
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
            scope: 2,
            code: 1,
            message: 'any',
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
});
