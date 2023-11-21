// Actually return a promise
// eslint-disable-next-line require-await
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
