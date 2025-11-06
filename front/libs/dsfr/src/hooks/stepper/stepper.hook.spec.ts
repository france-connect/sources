import { renderHook } from '@testing-library/react';
import type { Path } from 'react-router';
import { resolvePath } from 'react-router';

import { useStepper } from './stepper.hook';

describe('useStepper', () => {
  const stepsOrderedByOrder = [
    {
      order: 5,
      path: './first-step',
      title: 'First step',
    },
    {
      order: 23,
      path: './second-step',
      title: 'Second step',
    },
    {
      order: 51,
      path: './pastis-step',
      title: 'Pastis step',
    },
  ];
  const configMock = {
    basePath: '/base-path',
    steps: stepsOrderedByOrder,
  };

  beforeEach(() => {
    // Given
    jest
      .mocked(resolvePath)
      .mockReturnValueOnce({
        pathname: '/base-path/first-step',
      } as Path)
      .mockReturnValueOnce({
        pathname: '/base-path/second-step',
      } as Path)
      .mockReturnValueOnce({
        pathname: '/base-path/pastis-step',
      } as Path);
  });

  it('should return the current step matching the current location pathname', () => {
    // When
    const { result } = renderHook(() =>
      useStepper({
        basePath: configMock.basePath,
        pathname: '/base-path/first-step',
        steps: configMock.steps,
      }),
    );

    // Then
    expect(result.current.currentStep).toStrictEqual({
      index: 0,
      isLastStep: false,
      nextStepTitle: 'Second step',
      order: 5,
      path: './first-step',
      resolvedPathname: '/base-path/first-step',
      title: 'First step',
    });
  });

  it('should return the current step matching the current location pathname, when pathname is equal to last step', () => {
    // When
    const { result } = renderHook(() =>
      useStepper({
        basePath: configMock.basePath,
        pathname: '/base-path/pastis-step',
        steps: configMock.steps,
      }),
    );

    // Then
    expect(result.current.currentStep).toStrictEqual({
      index: 2,
      isLastStep: true,
      nextStepTitle: undefined,
      order: 51,
      path: './pastis-step',
      resolvedPathname: '/base-path/pastis-step',
      title: 'Pastis step',
    });
  });

  it('should return undefined if the pathname does not match', () => {
    // When
    const { result } = renderHook(() =>
      useStepper({
        basePath: configMock.basePath,
        pathname: '/base-path/acme-step',
        steps: configMock.steps,
      }),
    );

    // Then
    expect(result.current.currentStep).toBeUndefined();
  });
});
