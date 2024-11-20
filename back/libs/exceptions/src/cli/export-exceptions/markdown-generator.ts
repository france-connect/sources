import { ExceptionDocumentationInterface } from '../../types';

export default class MarkdownGenerator {
  static removeExceptionsWithoutCode(
    exception: ExceptionDocumentationInterface,
  ): boolean {
    return exception.CODE !== undefined;
  }

  static sortByCode(
    a: ExceptionDocumentationInterface,
    b: ExceptionDocumentationInterface,
  ): number {
    return a.errorCode > b.errorCode ? 1 : -1;
  }

  static groupExceptionsByScope(
    acc: Record<number, ExceptionDocumentationInterface[]>,
    info: ExceptionDocumentationInterface,
  ): { [key: number]: ExceptionDocumentationInterface[] } {
    const { SCOPE } = info;
    const previousInfos = acc[SCOPE] || [];
    const nextInfos = [...previousInfos, info];
    const accumulated = { ...acc, [SCOPE]: nextInfos };
    return accumulated;
  }

  static generate(loadedExceptions: ExceptionDocumentationInterface[]): {
    [key: number]: ExceptionDocumentationInterface[];
  } {
    const sorted = loadedExceptions
      .filter(MarkdownGenerator.removeExceptionsWithoutCode)
      .sort(MarkdownGenerator.sortByCode);

    MarkdownGenerator.checkForDuplicatedCodes(sorted);

    const groupsOfInfosByCode = sorted.reduce(
      MarkdownGenerator.groupExceptionsByScope,
      {},
    );

    const markdownContent = Object.values(groupsOfInfosByCode);
    return markdownContent;
  }

  static checkForDuplicatedCodes(
    sorted: ExceptionDocumentationInterface[],
  ): void {
    const double = sorted.find(
      ({ errorCode }, index) => errorCode === sorted[index - 1]?.errorCode,
    );

    if (double) {
      /**
       * @todo #1988 Fix inconsistent usage of codes and scopes across the codebase
       *
       * Uncomment the following code once fixed:
       *  throw new Error(`Error code ${double.errorCode} is duplicated`);
       */
      console.log(`Error code ${double.errorCode} is duplicated`);
    }
  }
}
