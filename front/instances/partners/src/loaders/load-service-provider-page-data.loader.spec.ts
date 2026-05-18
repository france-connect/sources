import type { LoaderFunctionArgs } from 'react-router';

import { PartnersService } from '@fc/core-partners';

import { loadServiceProviderPageData } from './load-service-provider-page-data.loader';

describe('loadServiceProviderPageData', () => {
  const paramsMock = {
    params: { serviceProviderId: 'sp-1' },
  } as unknown as LoaderFunctionArgs;

  beforeEach(() => {
    jest.mocked(PartnersService.loadServiceProviderById).mockResolvedValue({
      payload: { instances: [{ id: 'i1' }] },
    } as never);
    jest.mocked(PartnersService.loadLinkableInstancesByServiceProviderId).mockResolvedValue({
      payload: { linkableInstances: [{ id: 'i2' }] },
    } as never);
  });

  afterEach(() => {
    jest.mocked(PartnersService.loadServiceProviderById).mockReset();
    jest.mocked(PartnersService.loadLinkableInstancesByServiceProviderId).mockReset();
  });

  it('should load service provider and linkable instances in parallel', async () => {
    await loadServiceProviderPageData(paramsMock);

    expect(PartnersService.loadServiceProviderById).toHaveBeenCalledExactlyOnceWith(paramsMock);
    expect(
      PartnersService.loadLinkableInstancesByServiceProviderId,
    ).toHaveBeenCalledExactlyOnceWith(paramsMock);
  });

  it('should set hasUnlinkedInstances when at least one linkable instance exists', async () => {
    const result = await loadServiceProviderPageData(paramsMock);

    expect(result.type).toBe('loadServiceProviderPageData');
    expect(result.payload).toBeDefined();
    expect(result.payload!.hasUnlinkedInstances).toBeTrue();
  });

  it('should set hasUnlinkedInstances false when no linkable instances exist', async () => {
    jest.mocked(PartnersService.loadLinkableInstancesByServiceProviderId).mockResolvedValueOnce({
      payload: { linkableInstances: [] },
    } as never);

    const result = await loadServiceProviderPageData(paramsMock);

    expect(result.payload).toBeDefined();
    expect(result.payload!.hasUnlinkedInstances).toBeFalse();
  });
});
