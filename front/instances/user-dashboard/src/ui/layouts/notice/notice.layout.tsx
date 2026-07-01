import React from 'react';
import { Outlet } from 'react-router';

import { ConfigService } from '@fc/config';
import { NoticeComponent } from '@fc/dsfr';

import type { NoticeConfigInterface } from '../../../interfaces';

export const NoticeLayout = React.memo(() => {
  const { description, enabled, link, title, type } =
    ConfigService.get<NoticeConfigInterface>('Notice');

  if (!enabled) {
    return <Outlet />;
  }

  return (
    <React.Fragment>
      <NoticeComponent
        description={description}
        link={link && { href: link.href, label: link.label, title: link.label }}
        title={title}
        type={type}
      />
      <Outlet />
    </React.Fragment>
  );
});

NoticeLayout.displayName = 'NoticeLayout';
