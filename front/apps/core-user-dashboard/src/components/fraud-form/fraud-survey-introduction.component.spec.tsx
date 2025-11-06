import { render } from '@testing-library/react';

import { redirectToFraudSurvey } from '@fc/core-user-dashboard';
import { SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { FraudSurveyIntroductionComponent } from './fraud-survey-introduction.component';

describe('FraudSurveyIntroductionComponent', () => {
  beforeEach(() => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('any-title-mock')
      .mockReturnValueOnce('any-description-mock')
      .mockReturnValueOnce('any-button-mock');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<FraudSurveyIntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call T 3 times with correct params', () => {
    // When
    render(<FraudSurveyIntroductionComponent />);

    // Given
    expect(t).toHaveBeenCalledTimes(3);
    expect(t).toHaveBeenNthCalledWith(1, 'FraudForm.introduction.title');
    expect(t).toHaveBeenNthCalledWith(2, 'FraudForm.survey.description');
    expect(t).toHaveBeenNthCalledWith(3, 'FraudForm.survey.button');
  });

  it('should render SimpleButton', () => {
    // When
    render(<FraudSurveyIntroductionComponent />);

    // Then
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'any-button-mock',
        dataTestId: 'fraud-survey-button',
        onClick: redirectToFraudSurvey,
      },
      undefined,
    );
  });
});
