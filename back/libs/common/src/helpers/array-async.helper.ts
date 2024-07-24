export class ArrayAsyncHelper {
  static async filterAsync<T>(
    arr,
    predicate: (value: T, index: number, array: T[]) => Promise<boolean>,
  ): Promise<T> {
    const results = await ArrayAsyncHelper.mapAsync<T, boolean>(arr, predicate);

    return arr.filter((_v, index) => results[index]);
  }

  static async mapAsync<T, U>(
    arr: T[],
    predicate: (value: T, index: number, array: T[]) => Promise<U>,
  ): Promise<U[]> {
    return await Promise.all(arr.map(predicate));
  }

  static async everyAsync<T>(
    arr: T[],
    predicate: (value: T, index: number, array: T[]) => Promise<boolean>,
  ): Promise<boolean> {
    return (await ArrayAsyncHelper.mapAsync(arr, predicate)).every(Boolean);
  }

  static async reduceAsync<A = unknown, R = unknown>(
    arr: A[],
    predicate: (
      accumulator: R,
      currentValue: A,
      currentIndex: number,
      array: A[],
    ) => Promise<R>,
    initialValue: R,
  ): Promise<R> {
    return await arr.reduce<Promise<R>>(async (acc, curr, index) => {
      // We need to wait for the accumulator to resolve the previous call
      const awaitedAcc = await acc;
      const newAcc = await predicate(awaitedAcc, curr, index, arr);

      return newAcc;
    }, Promise.resolve(initialValue));
  }
}
