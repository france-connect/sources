import { IExceptionDocumentation } from '../../interfaces';

export default class MarkdownGenerator {
  static removeExceptionsWithoutCode(
    exception: IExceptionDocumentation,
  ): boolean {
    return exception.code !== undefined;
  }

  static sortByCode(
    a: IExceptionDocumentation,
    b: IExceptionDocumentation,
  ): number {
    // Way to compare two numbers
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/sort
    return a.scope - b.scope || a.code - b.code;
  }

  static groupExceptionsByScope(
    acc: Record<number, IExceptionDocumentation[]>,
    info: IExceptionDocumentation,
  ) {
    const { scope } = info;
    const previousInfos = acc[scope] || [];
    const nextInfos = [...previousInfos, info];
    const accumulated = { ...acc, [scope]: nextInfos };
    return accumulated;
  }

  static generate(loadedExceptions: IExceptionDocumentation[]): object[] {
    const groupsOfInfosByCode = loadedExceptions
      .filter(MarkdownGenerator.removeExceptionsWithoutCode)
      .sort(MarkdownGenerator.sortByCode)
      .reduce(MarkdownGenerator.groupExceptionsByScope, {});

    const markdownContent = Object.values(groupsOfInfosByCode);
    return markdownContent;
  }
}
