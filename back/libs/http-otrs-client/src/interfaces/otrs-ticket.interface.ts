export type OtrsDynamicFieldInterface = {
  name: string;
  value?: string | null;
};

export type OtrsArticleInterface = {
  articleId: number;
  articleNumber: number;
  subject: string;
  body: string;
  contentType: string;
  mimeType?: string;
  charset?: string;
  contentCharset?: string;
  from?: string;
  to?: string;
  cc?: string | null;
  bcc?: string | null;
  replyTo?: string | null;
  inReplyTo?: string | null;
  references?: string | null;
  messageId?: string;
  incomingTime?: number;
  senderType?: string;
  senderTypeId?: string;
  isVisibleForCustomer?: number;
  ticketId?: number;
  communicationChannelId?: number;
  timeUnit?: number;
  createTime?: string;
  createBy?: number;
  changeTime?: string;
  changeBy?: number;
};

export type OtrsTicketInterface = {
  ticketId: number;
  ticketNumber: string;
  title: string;
  dynamicField: OtrsDynamicFieldInterface[];
  article: OtrsArticleInterface[];
};

export type OtrsTicketUpdateResponseInterface = Pick<
  OtrsTicketInterface,
  'ticketId' | 'ticketNumber'
>;
