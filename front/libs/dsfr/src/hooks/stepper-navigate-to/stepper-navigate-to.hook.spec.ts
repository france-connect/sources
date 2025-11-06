import { renderHook } from '@testing-library/react';
import React from 'react';
import { resolvePath, useNavigate } from 'react-router';

import { useStepperNavigateTo } from './stepper-navigate-to.hook';

describe('useStepperNavigateTo', () => {
  // Given
  const navigateMock = jest.fn();
  const basePathMock = '/base-path';
  const resolvePathMock = {
    hash: expect.any(String),
    pathname: expect.any(String),
    search: expect.any(String),
  };
  const stepsMock = [
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

  beforeEach(() => {
    // Given
    jest.mocked(useNavigate).mockReturnValue(navigateMock);
    jest.mocked(resolvePath).mockReturnValue(resolvePathMock);
  });

  it('should return an object with navigation functions', () => {
    // Given
    const navigateToMock = jest.fn();
    const gotoNextStepMock = jest.fn();
    const gotoPreviousStepMock = jest.fn();
    jest
      .spyOn(React, 'useCallback')
      .mockReturnValueOnce(navigateToMock)
      .mockReturnValueOnce(gotoNextStepMock)
      .mockReturnValueOnce(gotoPreviousStepMock);

    // when
    const { result } = renderHook(() =>
      useStepperNavigateTo({
        basePath: basePathMock,
        currentStep: undefined,
        steps: stepsMock,
      }),
    );

    // Then
    expect(result.current).toEqual({
      gotoNextStep: gotoNextStepMock,
      gotoPreviousStep: gotoPreviousStepMock,
      navigateTo: navigateToMock,
    });
  });

  it('should navigate to a specific step', () => {
    // When
    const { result } = renderHook(() =>
      useStepperNavigateTo({
        basePath: basePathMock,
        currentStep: {
          ...stepsMock[2],
          index: 2,
          isLastStep: true,
        },
        steps: stepsMock,
      }),
    );
    result.current.navigateTo({
      order: 0,
      path: 'any-path-acme-string',
      title: 'any-title-acme-string',
    });

    // Then
    expect(resolvePath).toHaveBeenCalledOnce();
    expect(resolvePath).toHaveBeenCalledWith('any-path-acme-string', basePathMock);
    expect(navigateMock).toHaveBeenCalledOnce();
    expect(navigateMock).toHaveBeenCalledWith(resolvePathMock);
  });

  it('should navigate to the previous step', () => {
    // Given
    const navigateToMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockReturnValueOnce(navigateToMock);

    // When
    const { result } = renderHook(() =>
      useStepperNavigateTo({
        basePath: basePathMock,
        currentStep: {
          ...stepsMock[2],
          index: 2,
          isLastStep: true,
        },
        steps: stepsMock,
      }),
    );
    result.current.gotoPreviousStep();

    // Then
    expect(navigateToMock).toHaveBeenCalledOnce();
    expect(navigateToMock).toHaveBeenCalledWith(stepsMock[1]);
  });

  it('should not navigate to the previous step, if first step', () => {
    // Given
    const navigateToMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockReturnValueOnce(navigateToMock);

    // When
    const { result } = renderHook(() =>
      useStepperNavigateTo({
        basePath: basePathMock,
        currentStep: {
          ...stepsMock[0],
          index: 0,
          isLastStep: false,
        },
        steps: stepsMock,
      }),
    );
    result.current.gotoPreviousStep();

    // Then
    expect(navigateToMock).not.toHaveBeenCalled();
  });

  it('should navigate to the next step', () => {
    // Given
    const navigateToMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockReturnValueOnce(navigateToMock);

    // When
    const { result } = renderHook(() =>
      useStepperNavigateTo({
        basePath: basePathMock,
        currentStep: {
          ...stepsMock[1],
          index: 1,
          isLastStep: false,
        },
        steps: stepsMock,
      }),
    );
    result.current.gotoNextStep();

    // Then
    expect(navigateToMock).toHaveBeenCalledOnce();
    expect(navigateToMock).toHaveBeenCalledWith(stepsMock[2]);
  });

  it('should not navigate to the next step, if last step', () => {
    // Given
    const navigateToMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockReturnValueOnce(navigateToMock);

    // When
    const { result } = renderHook(() =>
      useStepperNavigateTo({
        basePath: basePathMock,
        currentStep: {
          ...stepsMock[2],
          index: 2,
          isLastStep: true,
        },
        steps: stepsMock,
      }),
    );
    result.current.gotoNextStep();

    // Then
    expect(navigateToMock).not.toHaveBeenCalled();
  });
});
