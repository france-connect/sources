import { renderHook } from '@testing-library/react';

import { MessageTypes } from '@fc/common';
import { RoutePaths, useNavigateWithState } from '@fc/routing';

import { PartnersAlertVariants } from '../../enums';
import { useDeletionNotifier } from './deletion-notifier.hook';

describe('useDeletionNotifier', () => {
  // Given
  const navigateWithStateMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useNavigateWithState).mockReturnValue({
      goBack: jest.fn(),
      goBackWithError: jest.fn(),
      goBackWithSuccess: jest.fn(),
      navigateWithState: navigateWithStateMock,
    });
  });

  it('should expose the deletion notifier', () => {
    // When
    const { result } = renderHook(() => useDeletionNotifier(PartnersAlertVariants.CONTRIBUTOR));

    // Then
    expect(result.current).toStrictEqual({ notifyDeletion: expect.any(Function) });
  });

  it('should replay the loaders of the current route with the deletion state of the variant', () => {
    // Given
    const { result } = renderHook(() => useDeletionNotifier(PartnersAlertVariants.INSTANCE));

    // When
    result.current.notifyDeletion('any-message-mock', 'any-title-mock', MessageTypes.SUCCESS);

    // Then
    expect(navigateWithStateMock).toHaveBeenCalledExactlyOnceWith(
      RoutePaths.CURRENT,
      {
        message: 'any-message-mock',
        title: 'any-title-mock',
        type: MessageTypes.SUCCESS,
        variant: PartnersAlertVariants.INSTANCE,
      },
      true,
    );
  });
});
