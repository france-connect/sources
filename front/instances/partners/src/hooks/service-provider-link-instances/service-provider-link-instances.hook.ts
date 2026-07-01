import { useCallback } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';

import type { FSAInterface, UUIDType } from '@fc/common';
import type { InstanceInterface } from '@fc/core-partners';
import { PartnersService } from '@fc/core-partners';
import { useNavigateWithState } from '@fc/routing';

// @NOTE investigate to know why we need this interface here
// and nowhere else
interface LinkInstancesLoaderPayloadInterface {
  datapassRequestId: string;
  serviceProviderId: UUIDType;
  serviceProviderName?: string;
  linkableInstances: InstanceInterface[];
}

// @NOTE investigate to know why we need this interface here
// Create a generic one ?
interface LinkInstancesFormValuesInterface {
  instances: Record<string, boolean>;
}

export const useLinkableInstancesToServiceProvider = () => {
  const { payload } = useLoaderData<Required<FSAInterface<LinkInstancesLoaderPayloadInterface>>>();
  const { datapassRequestId, linkableInstances, serviceProviderId, serviceProviderName } = payload;

  const { revalidate } = useRevalidator();

  const { goBack, goBackWithSuccess } = useNavigateWithState();

  // Pre-check instances whose signupId matches the target SP's datapassRequestId,
  // so the user sees the most relevant instances already selected on page load.
  const initialValues: LinkInstancesFormValuesInterface = {
    instances: linkableInstances.reduce<Record<string, boolean>>((acc, { currentVersion, id }) => {
      const signupId = currentVersion.data.signupId?.trim();
      acc[id] = Boolean(signupId) && signupId === datapassRequestId.trim();
      return acc;
    }, {}),
  };

  const validateHandler = ({ instances }: LinkInstancesFormValuesInterface) => {
    const hasSelection = instances && Object.values(instances).some(Boolean);
    return hasSelection ? undefined : { instances: 'error' };
  };

  const handleSubmit = useCallback(
    async ({ instances }: LinkInstancesFormValuesInterface) => {
      const selectedInstanceIds = Object.entries(instances)
        .filter(([, checked]) => checked)
        .map(([id]) => id);

      await PartnersService.linkInstancesToServiceProvider({
        instanceIds: selectedInstanceIds,
        serviceProviderId,
      });

      // @NOTE should be done into form.postSubmit
      revalidate();
      goBackWithSuccess({
        message: 'Partners.serviceProviderPage.linkInstances.success.description',
        title: 'Partners.instances.successLink',
      });
    },
    [goBackWithSuccess, revalidate, serviceProviderId],
  );

  const handleCancel = useCallback(() => {
    goBack();
  }, [goBack]);

  return {
    handleCancel,
    handleSubmit,
    initialValues,
    linkableInstances,
    serviceProviderName,
    validateHandler,
  };
};
