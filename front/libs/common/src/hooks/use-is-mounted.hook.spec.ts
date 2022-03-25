import { renderHook } from '@testing-library/react-hooks';

import { useIsMounted } from './use-is-mounted.hook';

describe('useIsMounted', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => useIsMounted());
    expect(result.current).toBeInstanceOf(Function);
  });

  it('should return true when component is mounted', () => {
    const { result } = renderHook(() => useIsMounted());
    expect(result.current()).toBe(true);
  });

  it('should return false when component is not mounted', () => {
    const { result, unmount } = renderHook(() => useIsMounted());
    unmount();
    expect(result.current()).toBe(false);
  });
});
