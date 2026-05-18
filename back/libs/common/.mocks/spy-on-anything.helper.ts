export function spyOnAnything<T extends object, K extends string>(
  obj: T,
  key: K,
): jest.SpyInstance {
  return jest.spyOn(
    obj as unknown as Record<K, (...args: unknown[]) => unknown>,

    /**
     * Since private methods are not properties of T,
     * we need to cast to any for TS to allow it
     */
    key as any,
  );
}
