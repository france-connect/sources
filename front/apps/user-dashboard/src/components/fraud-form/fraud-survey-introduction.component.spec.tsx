import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { SimpleButton } from '@fc/dsfr';
import { redirectToFraudSurvey } from '@fc/user-dashboard';

import type { FraudConfigInterface } from '../../interfaces';
import { FraudSurveyIntroductionComponent } from './fraud-survey-introduction.component';

describe('FraudSurveyIntroductionComponent', () => {
  const fraudConfig: FraudConfigInterface = {
    apiRouteFraudForm: 'any-route',
    fraudSupportFormPathname: 'any-pathname',
    fraudSurveyUrl: 'fraud-survey-url',
    supportFormUrl: 'support-form-url',
    surveyOriginQueryParam: 'any-param',
  };

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue(fraudConfig);
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<FraudSurveyIntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render SimpleButton', () => {
    // When
    render(<FraudSurveyIntroductionComponent />);

    // Then
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        dataTestId: 'fraud-survey-button',
        label: 'Commencer la vérification',
        onClick: redirectToFraudSurvey,
      },
      {},
    );
  });
});
