import { renderHook } from '@testing-library/react';

import { useSafeContext } from '@fc/common';

import { AccountContext } from '../context';
import type { AccountContextState, UserInfosInterface } from '../interfaces';
import { useAccountContext } from './account-context.hook';

describe('useAccountContext', () => {
  it('should call useSafeContext with the account context', () => {
    // Given
    renderHook(() => useAccountContext());

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should return the account context state', () => {
    // Given
    const accountContextState = Symbol(
      'accountContextState',
    ) as unknown as AccountContextState<UserInfosInterface>;

    jest.mocked(useSafeContext).mockReturnValue(accountContextState);

    // When
    const { result } = renderHook(() => useAccountContext());

    // Then
    expect(result.current).toEqual(accountContextState);
  });
});
