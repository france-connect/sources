/**
 * Replace the parameters in the path with the values in the params object.
 * Example:
 * parameterizedPath('/request/:id', { id: '123' }) => '/request/123'
 */
export function parameterizedPath(
  path: string,
  params: Record<string, string>,
): string {
  return path.replace(/:(\w+)/g, (match, word) => params[word] || match);
}
