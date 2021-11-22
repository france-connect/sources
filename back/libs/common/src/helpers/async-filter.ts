export async function asyncFilter<T>(arr, predicate): Promise<T> {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => results[index]);
}
