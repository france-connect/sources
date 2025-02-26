import { isURL } from 'validator';

import { isWebsiteURL } from './is-website-url.validator';

describe('isWebsiteURL', () => {
  it('should call isURL with params', () => {
    // Given
    const resultMock = Symbol('is-url-mock') as unknown as boolean;

    jest.mocked(isURL).mockReturnValueOnce(resultMock);

    // When
    const result = isWebsiteURL('https://franceconnect.gouv.fr');

    // Then
    expect(result).toBe(resultMock);
    expect(isURL).toHaveBeenCalledOnce();
    expect(isURL).toHaveBeenCalledWith('https://franceconnect.gouv.fr', {
      protocols: ['https'],
      // validatorjs naming
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
    });
  });
});
