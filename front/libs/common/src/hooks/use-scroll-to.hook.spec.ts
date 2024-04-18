import { renderHook } from '@testing-library/react';

import { useScrollTo } from './use-scroll-to.hook';

describe('useScrollTo', () => {
  it('should get to the top of the screen', () => {
    // given
    jest.spyOn(window, 'scrollTo').mockImplementation(jest.fn());
    const { result } = renderHook(() => useScrollTo());

    // When
    result.current.scrollToTop();

    // Then
    expect(window.scrollTo).toHaveBeenCalledOnce();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
