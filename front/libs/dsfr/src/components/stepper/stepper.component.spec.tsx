import { render } from '@testing-library/react';

import { HeadingTag } from '@fc/common';
import { t } from '@fc/i18n';

import { StepperComponent } from './stepper.component';

describe('Stepper', () => {
  it('should match snapshot with current and next titles', () => {
    // given
    jest
      .mocked(t)
      .mockReturnValueOnce('stepper current mock')
      .mockReturnValueOnce('stepper next step mock');

    // when
    const { container, getByText } = render(
      <StepperComponent
        currentStep={1}
        currentStepTitle="current step title mock"
        nextStepTitle="next step title mock"
        totalSteps={5}
      />,
    );
    const titleElt = getByText('current step title mock');
    const nextTitleElt = getByText('next step title mock');

    // then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'DSFR.stepper.location', { current: 1, total: 5 });
    expect(t).toHaveBeenNthCalledWith(2, 'DSFR.stepper.nextStep');
    expect(titleElt).toBeInTheDocument();
    expect(nextTitleElt).toBeInTheDocument();
  });

  it('should match snapshot without next title', () => {
    // given
    jest.mocked(t).mockReturnValueOnce('stepper current mock');

    // when
    const { container, getByText } = render(
      <StepperComponent
        currentStep={1}
        currentStepTitle="current step title mock"
        totalSteps={5}
      />,
    );
    const titleElt = getByText('current step title mock');

    // then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('DSFR.stepper.location', { current: 1, total: 5 });
    expect(titleElt).toBeInTheDocument();
  });

  it('should match snapshot with a custom heading title', () => {
    // given
    jest.mocked(t).mockReturnValueOnce('stepper current mock');

    // when
    const { container, getByTestId } = render(
      <StepperComponent
        currentStep={1}
        currentStepTitle="current step title mock"
        heading={HeadingTag.H3}
        totalSteps={5}
      />,
    );
    const headingElt = getByTestId('stepper-component-heading-title');

    // then
    expect(container).toMatchSnapshot();
    expect(headingElt).toBeInTheDocument();
    expect(headingElt.tagName).toBe('H3');
  });
});
