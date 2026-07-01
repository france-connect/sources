import type { MessageTypes } from '@fc/common';

export interface NoticeConfigLinkInterface {
  href: string;
  label: string;
}

export interface NoticeConfigInterface {
  enabled: boolean;
  title: string;
  type: MessageTypes;
  description?: string;
  link?: NoticeConfigLinkInterface;
}
