export function countOccurrences<T>(
  items: T[],
  key: keyof T,
): Record<string, number> {
  return items
    .map((item) => item[key])
    .filter(Boolean)
    .map(String)
    .reduce(
      (acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
}
