import { renderHook } from '@testing-library/react';
import React from 'react';

import { useContentHeight } from './content-height.hook';

describe('useAccordionContentHeight', () => {
  it('should return a zero height if clientHeight is not reachable', () => {
    // given
    jest.spyOn(React, 'useRef');
    // When
    const { result } = renderHook(() => useContentHeight());
    // Then
    expect(result.current.contentHeight).toBe(0);
  });

  it('should return the height of the content in ref', () => {
    // given
    const heightMock = expect.any(Number);
    const refMock = { current: { clientHeight: heightMock } };
    jest.spyOn(React, 'useRef').mockReturnValue(refMock);
    // When
    const { result } = renderHook(() => useContentHeight());
    // Then
    expect(result.current.contentHeight).toBe(heightMock);
  });
});
