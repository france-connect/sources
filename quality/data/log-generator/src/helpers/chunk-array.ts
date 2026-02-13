export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const results: T[][] = [];
  if (!Array.isArray(array)) {
    throw new Error('The first parameter must be an array');
  }
  if (chunkSize < 1) {
    throw new Error('Chunk size must be at least 1');
  }

  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
};
