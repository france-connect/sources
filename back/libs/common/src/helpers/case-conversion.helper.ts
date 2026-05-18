export function pascalToCamelCase(str: string): string {
  return str.substring(0, 1).toLowerCase() + str.substring(1);
}

export function camelToPascalCase(str: string): string {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

export function objectPropertiesPascalToCamel<
  T extends Record<string, unknown> = Record<string, unknown>,
  U extends object = Record<string, unknown>,
>(object: U): T {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      pascalToCamelCase(key),
      value,
    ]),
  ) as T;
}

export function objectPropertiesCamelToPascal<
  T extends Record<string, unknown> = Record<string, unknown>,
  U extends object = Record<string, unknown>,
>(object: U): T {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      camelToPascalCase(key),
      value,
    ]),
  ) as T;
}
