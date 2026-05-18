import { useCallback } from 'react';
import { useLoaderData, useNavigate } from 'react-router';

import type { FSAInterface, UUIDType } from '@fc/common';
import { MessageTypes } from '@fc/common';
import type { InstanceInterface } from '@fc/core-partners';
import { PartnersService } from '@fc/core-partners';

import { SubmitTypesMessage } from '../../enums';
import { usePostSubmit } from '../post-submit/post-submit.hook';

interface LinkInstancesLoaderPayloadInterface {
  datapassRequestId: string;
  serviceProviderId: UUIDType;
  serviceProviderName?: string;
  linkableInstances: InstanceInterface[];
}

export interface LinkInstancesFormValuesInterface {
  instances: Record<string, boolean>;
}

export const useLinkableInstancesToServiceProvider = () => {
  const navigate = useNavigate();
  const response = useLoaderData();
  const { payload } = response as Required<FSAInterface<LinkInstancesLoaderPayloadInterface>>;
  const { datapassRequestId, linkableInstances, serviceProviderId, serviceProviderName } = payload;

  const postSubmit = usePostSubmit(SubmitTypesMessage.INSTANCES_SUCCESS_LINK, MessageTypes.SUCCESS);

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

  const handleSubmit = async ({ instances }: LinkInstancesFormValuesInterface) => {
    const selectedInstanceIds = Object.entries(instances)
      .filter(([, checked]) => checked)
      .map(([id]) => id);

    await PartnersService.linkInstancesToServiceProvider({
      instanceIds: selectedInstanceIds,
      serviceProviderId,
    });
    await postSubmit();
  };

  // @NOTE DEV
  // @SEE instances/partners/src/hooks/post-submit/post-submit.hook.ts
  const handleCancel = useCallback(() => navigate('..'), [navigate]);

  return {
    handleCancel,
    handleSubmit,
    initialValues,
    linkableInstances,
    serviceProviderName,
    validateHandler,
  };
};
