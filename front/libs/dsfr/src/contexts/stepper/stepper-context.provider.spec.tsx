import { render } from '@testing-library/react';
import { use } from 'react';
import type { Location } from 'react-router';
import { useLocation } from 'react-router';

import { HeadingTag, sortByKey } from '@fc/common';

import { StepperComponent } from '../../components';
import { useStepper, useStepperNavigateTo } from '../../hooks';
import { StepperContext } from './stepper.context';
import { StepperContextProvider } from './stepper-context.provider';

jest.mock('./stepper.context');
jest.mock('../../components/stepper/stepper.component');
jest.mock('../../hooks/stepper-navigate-to/stepper-navigate-to.hook');
jest.mock('../../hooks/stepper/stepper.hook');

describe('StepperContextProvider', () => {
  const stepMock1 = {
    order: 10,
    path: './first-step',
    title: 'First step',
  };

  const stepMock2 = {
    order: 30,
    path: './second-step',
    title: 'Second step',
  };

  const configMock = {
    basePath: '/base-path',
    steps: [stepMock1, stepMock2],
  };

  const navigateToMock = jest.fn();
  const gotoNextStepToMock = jest.fn();
  const gotoPreviousStepToMock = jest.fn();

  const firstCurrentStepMock = {
    index: 0,
    isLastStep: false,
    nextStepTitle: stepMock2.title,
    order: 10,
    path: stepMock1.path,
    resolvedPathname: `/base-path/${stepMock1.path}`,
    title: stepMock1.title,
  };

  const StepperContextProviderConsumerMock = () => {
    const context = use(StepperContext);
    return (
      <button data-testid="StepperContext.Consumer.button" onClick={context?.gotoNextStep}>
        Next Step
      </button>
    );
  };

  const ProviderMock = () => (
    <StepperContextProvider config={configMock}>
      <StepperContextProviderConsumerMock />
    </StepperContextProvider>
  );

  beforeEach(() => {
    // Given
    jest.mocked(useLocation).mockReturnValue({
      pathname: '/any-base-path/any-path-mock',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as Location<any>);
    jest.mocked(useStepper).mockReturnValue({
      currentStep: undefined,
    });
    jest.mocked(useStepperNavigateTo).mockReturnValue({
      gotoNextStep: gotoNextStepToMock,
      gotoPreviousStep: gotoPreviousStepToMock,
      navigateTo: navigateToMock,
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

  it('should call useStepper with params', () => {
    // Given
    const orderedStepsMock = [stepMock1, stepMock2];

    // When
    render(<ProviderMock />);

    // Then
    expect(useStepper).toHaveBeenCalledOnce();
    expect(useStepper).toHaveBeenCalledWith({
      basePath: '/base-path',
      pathname: '/any-base-path/any-path-mock',
      steps: orderedStepsMock,
    });
  });

  it('should call useStepperNavigateTo with params', () => {
    // When
    render(<ProviderMock />);

    // Then
    expect(useStepperNavigateTo).toHaveBeenCalledOnce();
    expect(useStepperNavigateTo).toHaveBeenCalledWith({
      basePath: configMock.basePath,
      currentStep: undefined,
      steps: [stepMock1, stepMock2],
    });
  });

  it('should match the snapshot, when currentStep is undefined', () => {
    // When
    const { container } = render(<ProviderMock />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when currentStep is defined', () => {
    // Given
    jest.mocked(useStepper).mockReturnValue({
      currentStep: firstCurrentStepMock,
    });

    // When
    const { container } = render(<ProviderMock />);

    // Then
    expect(container).toMatchSnapshot();
    expect(StepperComponent).toHaveBeenCalledOnce();
    expect(StepperComponent).toHaveBeenCalledWith(
      {
        heading: HeadingTag.H6,
        nextStepTitle: firstCurrentStepMock.nextStepTitle,
        stepNumber: 1,
        stepTitle: firstCurrentStepMock.title,
        totalSteps: 2,
      },
      undefined,
    );
    expect(StepperContext.Provider).toHaveBeenCalledOnce();
    expect(StepperContext.Provider).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        value: {
          currentStep: firstCurrentStepMock,
          gotoNextStep: gotoNextStepToMock,
          gotoPreviousStep: gotoPreviousStepToMock,
        },
      },
      undefined,
    );
  });
});
