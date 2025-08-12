import { fireEvent, render } from '@testing-library/react';
import React, { use } from 'react';
import type { Location, Path } from 'react-router';
import { resolvePath, useLocation, useNavigate } from 'react-router';

import { HeadingTag, sortByKey } from '@fc/common';

import { StepperComponent } from '../../components';
import { useStepperNavigation } from '../../hooks';
import { StepperContext } from './stepper.context';
import { StepperContextProvider } from './stepper-context.provider';

jest.mock('./stepper.context');
jest.mock('../../components/stepper/stepper.component');
jest.mock('../../hooks/stepper-navigation/stepper-navigation.hook');

describe('StepperContextProvider', () => {
  const configMock = {
    basePath: '/base-path',
    steps: [
      {
        order: 1,
        path: './first-step',
        title: 'First step',
      },
      {
        order: 2,
        path: './second-step',
        title: 'Second step',
      },
    ],
  };

  const firstCurrentStepMock = {
    isLastStep: false,
    nextStepTitle: 'Second step',
    order: 1,
    path: './first-step',
    resolvedPathname: '/base-path/first-step',
    title: 'First step',
  };

  const StepperContextProviderConsumerMock = () => {
    const { gotoNextStep } = use(StepperContext);
    return (
      <button data-testid="StepperContext.Consumer.button" onClick={gotoNextStep}>
        Next Step
      </button>
    );
  };

  const ProviderMock = () => (
    <StepperContextProvider config={configMock}>
      <StepperContextProviderConsumerMock />
    </StepperContextProvider>
  );

  const navigateMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useNavigate).mockReturnValue(navigateMock);
    jest.mocked(useLocation).mockReturnValue({
      pathname: '/any-base-path/any-path-mock',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as Location<any>);
    // Given
    jest.mocked(useStepperNavigation).mockReturnValue({
      currentStep: undefined,
    });
  });

  it('should sort steps by order', () => {
    // Given
    const sorterMock = jest.fn();
    jest.mocked(sortByKey).mockImplementationOnce(() => sorterMock);

    // When
    render(<ProviderMock />);

    // Then
    expect(sortByKey).toHaveBeenCalledOnce();
    expect(sortByKey).toHaveBeenCalledWith('order');
    expect(sorterMock).toHaveBeenCalledOnce();
    expect(sorterMock).toHaveBeenNthCalledWith(1, configMock.steps[1], configMock.steps[0]);
  });

  it('should call useStepperNavigation with params', () => {
    // When
    render(<ProviderMock />);

    // Then
    expect(useStepperNavigation).toHaveBeenCalledOnce();
    expect(useStepperNavigation).toHaveBeenCalledWith({
      basePath: '/base-path',
      pathname: expect.any(String),
      steps: configMock.steps,
    });
  });

  it('should navigate to next step when gotoNextStep is called', () => {
    // Given
    jest.mocked(useStepperNavigation).mockReturnValueOnce({ currentStep: firstCurrentStepMock });

    const pathMock = {
      pathname: '/base-path/second-step',
    } as Path;
    jest.mocked(resolvePath).mockReturnValueOnce(pathMock);

    const useEffectMock = jest.fn();
    jest.spyOn(React, 'useEffect').mockImplementationOnce(() => useEffectMock);

    // When
    const { getByTestId } = render(
      <StepperContextProvider config={configMock}>
        <StepperContextProviderConsumerMock />
      </StepperContextProvider>,
    );
    const buttonElt = getByTestId('StepperContext.Consumer.button');
    fireEvent.click(buttonElt);

    // Then
    expect(resolvePath).toHaveBeenCalledOnce();
    expect(resolvePath).toHaveBeenCalledWith('./second-step', '/base-path');
    expect(navigateMock).toHaveBeenCalledOnce();
    expect(navigateMock).toHaveBeenCalledWith(pathMock);
  });

  it('should match the snapshot, when currentStep is undefined', () => {
    // When
    const { container } = render(<ProviderMock />);

    // Then
    expect(container).toMatchSnapshot();
    expect(StepperComponent).not.toHaveBeenCalled();
    expect(StepperContext.Provider).not.toHaveBeenCalledOnce();
  });

  it('should match the snapshot, when currentStep is defined', () => {
    // Given
    jest.mocked(useStepperNavigation).mockReturnValue({
      currentStep: firstCurrentStepMock,
    });

    const gotoNextStepMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockImplementationOnce(() => gotoNextStepMock);

    // When
    const { container } = render(<ProviderMock />);

    // Then
    expect(container).toMatchSnapshot();
    expect(StepperComponent).toHaveBeenCalledOnce();
    expect(StepperComponent).toHaveBeenCalledWith(
      {
        currentStep: firstCurrentStepMock.order,
        currentStepTitle: firstCurrentStepMock.title,
        heading: HeadingTag.H6,
        nextStepTitle: firstCurrentStepMock.nextStepTitle,
        totalSteps: 2,
      },
      undefined,
    );
  });
});
