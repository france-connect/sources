import { renderHook } from '@testing-library/react';
import React from 'react';

import { useContentHeight } from './content-height.hook';

describe('useContentHeight', () => {
  it('should return a zero height if the element is not reachable', () => {
    // When
    const { result } = renderHook(() => useContentHeight());

    // Then
    expect(result.current.contentHeight).toBe(0);
  });

  it('should return the height from getBoundingClientRect', () => {
    // Given
    const heightMock = 120;
    const refMock = {
      current: {
        getBoundingClientRect: jest.fn(() => ({ height: heightMock })),
      },
    };
    jest.spyOn(React, 'useRef').mockReturnValueOnce(refMock).mockReturnValueOnce(refMock);

    // When
    const { result } = renderHook(() => useContentHeight());

    // Then
    expect(result.current.contentHeight).toBe(heightMock);
  });

  it('should add the offset to the measured height', () => {
    // Given
    const heightMock = 120;
    const offsetMock = 2;
    const refMock = {
      current: {
        getBoundingClientRect: jest.fn(() => ({ height: heightMock })),
      },
    };
    jest.spyOn(React, 'useRef').mockReturnValueOnce(refMock).mockReturnValueOnce(refMock);

    // When
    const { result } = renderHook(() => useContentHeight({ offset: offsetMock }));

    // Then
    expect(result.current.contentHeight).toBe(heightMock + offsetMock);
  });
});
