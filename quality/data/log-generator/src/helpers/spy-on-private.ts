export function spyOnPrivate<T extends object, K extends string>(
  obj: T,
  key: K,
): jest.SpyInstance {
  return jest.spyOn(
    obj as unknown as Record<K, (...args: unknown[]) => unknown>,
    /**
     * Since private methods are not properties of T,
     * we need to cast to any for TS to allow it
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key as any,
  );
}
