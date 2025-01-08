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
    MarkdownGenerator.checkForPathInconsistency(sorted);

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
      throw new Error(`Error code ${double.errorCode} is duplicated`);
    }
  }

  static checkForPathInconsistency(
    exceptions: ExceptionDocumentationInterface[],
  ): void {
    let scope: number;
    let lastPath: string;

    exceptions.forEach((exception) => {
      const path = exception.path.split('/src/exceptions/')[0];

      if (scope !== exception.SCOPE) {
        scope = exception.SCOPE;
        lastPath = path;
      }

      if (lastPath !== path) {
        throw new Error(
          `Path inconsistency in scope ${scope}: ${lastPath} !== ${exception.path}`,
        );
      }
    });
  }
}
