import { useEffect, useState } from 'react';

import { ServiceProviderConfigsItems } from '../../interfaces';
import { useAddServiceProviderConfig } from '../add-service-provider-config';
import { useGetServiceProviderConfigs } from '../get-service-provider-configs';

export const useServiceProviderSandbox = (id: string) => {
  const [configs, setConfigs] = useState<ServiceProviderConfigsItems>({
    items: [],
    total: 0,
  });
  const { fetchedConfigs } = useGetServiceProviderConfigs(id);
  const { addConfig, configAdded } = useAddServiceProviderConfig(id);

  useEffect(() => {
    if (fetchedConfigs) {
      setConfigs(fetchedConfigs);
    }
  }, [fetchedConfigs]);

  useEffect(() => {
    if (configAdded) {
      const { items: configAddedItem, total } = configAdded;
      setConfigs({
        items: [...configs.items, ...configAddedItem],
        total,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configAdded]);

  return {
    addConfig,
    configs,
  };
};
