import React from 'react';

import {
  InstancePageFormComponent,
  InstancePageHeaderComponent,
  InstancePageNoticeComponent,
} from '@fc/core-partners';
import { t } from '@fc/i18n';

import { useInstanceUpdate } from '../../../hooks';

export const InstanceUpdatePage = React.memo(() => {
  const { config, initialValues, postSubmit, preSubmit, schema, submitHandler } =
    useInstanceUpdate();

  const pageTitle = t('Partners.updatepage.title');
  const pageIntro = t('Partners.instance.updateIntro');
  return (
    <React.Fragment>
      <InstancePageHeaderComponent intro={pageIntro} title={pageTitle} />
      <InstancePageNoticeComponent />
      <InstancePageFormComponent
        config={config}
        initialValues={initialValues}
        postSubmit={postSubmit}
        preSubmit={preSubmit}
        schema={schema}
        submitHandler={submitHandler}
      />
    </React.Fragment>
  );
});

InstanceUpdatePage.displayName = 'InstanceUpdatePage';
