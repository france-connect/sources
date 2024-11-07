import { ConfigService } from '@fc/config';
import { redirectToUrl } from '@fc/routing';

import { redirectToFraudSurvey } from './redirect-to-fraud-survey.util';

describe('redirectToFraudSurvey', () => {
  beforeEach(() => {
    jest.mocked(ConfigService.get).mockReturnValue({
      fraudSurveyUrl: 'mock-url',
    });
  });

  it('should call redirectToUrl with fraudSurveyUrl', () => {
    // When
    redirectToFraudSurvey();

    // Then
    expect(redirectToUrl).toHaveBeenCalledOnce();
    expect(redirectToUrl).toHaveBeenCalledWith('mock-url');
  });
});
