import { ConfigService } from '@fc/config';

import { getFraudSupportFormUrl } from './get-fraud-support-form-url.util';

describe('useFraud', () => {
  beforeEach(() => {
    jest.mocked(ConfigService.get).mockReturnValue({
      fraudSupportFormPathname: '/usurpation',
      supportFormUrl: 'mock-url',
      surveyOriginQueryParam: 'fraudSurveyOrigin',
    });
  });

  it('should return fraudSupportFormUrl with unknown surveyOrigin', () => {
    // When
    const fraudSupportFormUrl = getFraudSupportFormUrl('');

    // Then
    expect(fraudSupportFormUrl).toBe('mock-url/usurpation/unknown');
  });

  it('should return fraudSupportFormUrl with surveyOrigin', () => {
    // When
    const fraudSupportFormUrl = getFraudSupportFormUrl('?fraudSurveyOrigin=mock-origin');

    // Then
    expect(fraudSupportFormUrl).toBe('mock-url/usurpation/mock-origin');
  });
});
