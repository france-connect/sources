import { renderHook } from '@testing-library/react';
import { useNavigate } from 'react-router';

import { usePostSubmit } from './post-submit.hook';

describe('usePostSubmit', () => {
  const messageMock = 'any-message-mock';
  const typeMock = 'any-type-mock';
  const navigateMock = jest.fn();
  const useNavigateMock = jest.mocked(useNavigate);

  beforeEach(() => {
    useNavigateMock.mockReturnValue(navigateMock);
  });

  it('should return a function', () => {
    // When
    const { result } = renderHook(() => usePostSubmit(messageMock, typeMock));

    // Then
    expect(result.current).toBeInstanceOf(Function);
  });

  it('should call navigate with correct parameters', () => {
    // Given
    const { result } = renderHook(() => usePostSubmit(messageMock, typeMock));

    // When
    result.current();

    // Then
    expect(navigateMock).toHaveBeenCalledWith('..', {
      replace: true,
      state: { submitState: { message: messageMock, type: typeMock } },
    });
  });
});
