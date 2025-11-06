import React from 'react';

import {
  InstancePageFormComponent,
  InstancePageHeaderComponent,
  InstancePageNoticeComponent,
} from '@fc/core-partners';
import { t } from '@fc/i18n';

import { useInstanceCreate } from '../../../hooks';

export const InstanceCreatePage = React.memo(() => {
  const { config, initialValues, postSubmit, preSubmit, schema, submitHandler } =
    useInstanceCreate();

  const pageTile = t('Partners.createpage.title');
  const pageIntro = t('Partners.instance.createIntro');
  return (
    <React.Fragment>
      <InstancePageHeaderComponent intro={pageIntro} title={pageTile} />
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

InstanceCreatePage.displayName = 'InstanceCreatePage';
