import { renderHook } from '@testing-library/react';
import type { Path } from 'react-router';
import { resolvePath } from 'react-router';

import { useStepperNavigation } from './stepper-navigation.hook';

describe('useStepperNavigation', () => {
  const configMock = {
    basePath: '/base-path',
    steps: [
      {
        order: 2,
        path: './second-step',
        title: 'Second step',
      },
      {
        order: 1,
        path: './first-step',
        title: 'First step',
      },
    ],
  };

  beforeEach(() => {
    // Given
    jest
      .mocked(resolvePath)
      .mockReturnValueOnce({
        pathname: '/base-path/second-step',
      } as Path)
      .mockReturnValueOnce({
        pathname: '/base-path/first-step',
      } as Path);
  });

  it('should return the current step matching the current location pathname', () => {
    // When
    const { result } = renderHook(() =>
      useStepperNavigation({
        basePath: configMock.basePath,
        pathname: '/base-path/first-step',
        steps: configMock.steps,
      }),
    );

    // Then
    expect(result.current.currentStep).toStrictEqual({
      isLastStep: false,
      nextStepTitle: 'Second step',
      order: 1,
      path: './first-step',
      resolvedPathname: '/base-path/first-step',
      title: 'First step',
    });
  });

  it('should return the current step matching the current location pathname, when pathname is equal to last step', () => {
    // When
    const { result } = renderHook(() =>
      useStepperNavigation({
        basePath: configMock.basePath,
        pathname: '/base-path/second-step',
        steps: configMock.steps,
      }),
    );

    // Then
    expect(result.current.currentStep).toStrictEqual({
      isLastStep: true,
      nextStepTitle: undefined,
      order: 2,
      path: './second-step',
      resolvedPathname: '/base-path/second-step',
      title: 'Second step',
    });
  });

  it('should return undefined if the pathname does not match', () => {
    // When
    const { result } = renderHook(() =>
      useStepperNavigation({
        basePath: configMock.basePath,
        pathname: '/base-path/acme-step',
        steps: configMock.steps,
      }),
    );

    // Then
    expect(result.current.currentStep).toBeUndefined();
  });
});
