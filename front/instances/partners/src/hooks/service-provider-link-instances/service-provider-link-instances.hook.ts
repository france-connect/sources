import { useCallback, useMemo, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';

import type { FSAInterface } from '@fc/common';
import { useSelectable } from '@fc/common';
import type { InstanceInterface, LinkableInstancesPayloadInterface } from '@fc/core-partners';
import { PartnersAlertVariants, PartnersService } from '@fc/core-partners';
import { t } from '@fc/i18n';
import { useNavigateWithState } from '@fc/routing';

const getItemId = (item: InstanceInterface) => item.id;

export const useLinkableInstancesToServiceProvider = () => {
  const { payload } = useLoaderData<Required<FSAInterface<LinkableInstancesPayloadInterface>>>();
  const { datapassRequestId, linkableInstances, serviceProviderId, serviceProviderName } = payload;

  const { revalidate } = useRevalidator();

  const { goBack, goBackWithSuccess } = useNavigateWithState();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialSelection = useMemo(() => {
    const trimmedRequestId = datapassRequestId.trim();

    const selectedIds = linkableInstances.reduce<string[]>((acc, { currentVersion, id }) => {
      const signupId = currentVersion.data.signupId?.trim();
      const isLinked = signupId && signupId === trimmedRequestId;
      if (isLinked) {
        acc.push(id);
      }
      return acc;
    }, []);

    return new Set(selectedIds);
  }, [datapassRequestId, linkableInstances]);

  const selectable = useSelectable({
    getItemId,
    initialSelection,
    items: linkableInstances,
  });

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // @TODO error handling when linking instances to service provider fails
      await PartnersService.linkInstancesToServiceProvider({
        instanceIds: Array.from(selectable.selection),
        serviceProviderId,
      });

      revalidate();
      goBackWithSuccess({
        message: t('Partners.serviceProviderPage.linkInstances.success.description'),
        title: t('Partners.instances.successLink'),
        variant: PartnersAlertVariants.INSTANCE,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [goBackWithSuccess, revalidate, selectable.selection, serviceProviderId]);

  const canSubmit = !isSubmitting && selectable.selection.size > 0;

  return {
    canSubmit,
    handleCancel: goBack,
    handleSubmit,
    linkableInstances,
    selectable,
    serviceProviderName,
  };
};
