import { isURL } from 'validator';

import { isRedirectURL } from './is-redirect-url.validator';

describe('isRedirectURL', () => {
  it('should call isURL with params', () => {
    // Given
    const resultMock = Symbol('is-url-mock') as unknown as boolean;

    jest.mocked(isURL).mockReturnValueOnce(resultMock);

    // When
    const result = isRedirectURL('https://franceconnect.gouv.fr');

    // Then
    expect(result).toBe(resultMock);
    expect(isURL).toHaveBeenCalledOnce();
    expect(isURL).toHaveBeenCalledWith('https://franceconnect.gouv.fr', {
      protocols: ['http', 'https'],
      // validatorjs naming
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
      // validatorjs naming
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_tld: false,
    });
  });
});
