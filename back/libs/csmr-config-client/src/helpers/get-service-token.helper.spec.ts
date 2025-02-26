import { getServiceToken } from './get-service-token.helper';

describe('getServiceToken', () => {
  it('should return token with Config prefix', () => {
    const service = 'Service';

    const result = getServiceToken(service);

    expect(result).toBe('ConfigService');
  });
});
