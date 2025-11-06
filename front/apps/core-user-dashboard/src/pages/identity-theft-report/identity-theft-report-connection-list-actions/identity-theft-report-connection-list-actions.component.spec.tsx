import { render } from '@testing-library/react';

import { useSafeContext } from '@fc/common';
import { Priorities, SimpleButton, StepperContext } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { IdentityTheftReportConnectionListActionsComponent } from './identity-theft-report-connection-list-actions.component';

describe('IdentityTheftReportConnectionListActionsComponent', () => {
  // Given
  const gotoNextStepMock = jest.fn();
  const gotoPreviousStepMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useSafeContext).mockReturnValue({
      gotoNextStep: gotoNextStepMock,
      gotoPreviousStep: gotoPreviousStepMock,
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportConnectionListActionsComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useSafeContext with StepperContext', () => {
    // When
    render(<IdentityTheftReportConnectionListActionsComponent />);

    // Then
    expect(useSafeContext).toHaveBeenCalledExactlyOnceWith(StepperContext);
  });

  it('should render both buttons', () => {
    // When
    render(<IdentityTheftReportConnectionListActionsComponent />);

    // Then
    expect(SimpleButton).toHaveBeenCalledTimes(2);
    expect(SimpleButton).toHaveBeenNthCalledWith(
      1,
      {
        children: expect.any(String),
        className: 'fr-mr-2w',
        dataTestId: 'enter-new-code-button',
        onClick: gotoPreviousStepMock,
        priority: Priorities.SECONDARY,
      },
      undefined,
    );
    expect(SimpleButton).toHaveBeenNthCalledWith(
      2,
      {
        children: expect.any(String),
        dataTestId: 'validate-connections-button',
        onClick: gotoNextStepMock,
      },
      undefined,
    );
  });

  it('should call translations for both buttons', () => {
    // When
    render(<IdentityTheftReportConnectionListActionsComponent />);

    // Then
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'IdentityTheftReport.tracks.enterNewCode');
    expect(t).toHaveBeenNthCalledWith(2, 'DSFR.stepper.nextStepButton');
  });
});
