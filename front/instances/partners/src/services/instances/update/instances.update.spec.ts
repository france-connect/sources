import type { AxiosResponse } from 'axios';

import { ConfigService } from '@fc/config';
import { PartnersService } from '@fc/core-partners';

import { update } from './instances.update';

describe('update', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      endpoints: {
        instances: '/api-instances-mock',
      },
    });
  });

  it('should call PartnersService.commit with params', async () => {
    // Given
    const resultMock = Symbol('result-mock') as unknown as AxiosResponse;
    jest.mocked(PartnersService.commit).mockResolvedValueOnce(resultMock);

    // When
    const result = await update({ data: 'any-data-mock' }, 'any-instanceId-mock');

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Partners');
    expect(PartnersService.commit).toHaveBeenCalledOnce();
    expect(PartnersService.commit).toHaveBeenCalledWith(
      'put',
      '/api-instances-mock/any-instanceId-mock',
      {
        data: 'any-data-mock',
      },
    );
    expect(result).toStrictEqual(resultMock);
  });
});
