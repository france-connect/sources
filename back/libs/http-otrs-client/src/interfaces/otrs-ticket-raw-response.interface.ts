import { OtrsErrorResponseInterface } from './otrs-error-response.interface';

export type OtrsRawDynamicFieldInterface = {
  Name: string;
  Value?: string | null;
};

export type OtrsRawArticleInterface = {
  ArticleID: number;
  ArticleNumber: number;
  Subject: string;
  Body: string;
  ContentType: string;
  MimeType?: string;
  Charset?: string;
  ContentCharset?: string;
  From?: string;
  To?: string;
  Cc?: string | null;
  Bcc?: string | null;
  ReplyTo?: string | null;
  InReplyTo?: string | null;
  References?: string | null;
  MessageID?: string;
  IncomingTime?: number;
  SenderType?: string;
  SenderTypeID?: string;
  IsVisibleForCustomer?: number;
  TicketID?: number;
  CommunicationChannelID?: number;
  TimeUnit?: number;
  CreateTime?: string;
  CreateBy?: number;
  ChangeTime?: string;
  ChangeBy?: number;
};

type OtrsRawTicketInterface = {
  TicketID: number;
  TicketNumber: string;
  Title: string;
  DynamicField: OtrsRawDynamicFieldInterface[];
  Article: OtrsRawArticleInterface[];
};

export type OtrsTicketSearchResponseInterface = OtrsErrorResponseInterface & {
  TicketID?: string[];
};

export type OtrsTicketGetResponseInterface = OtrsErrorResponseInterface & {
  Ticket?: OtrsRawTicketInterface[];
};

export type OtrsTicketUpdateRawResponseInterface = OtrsErrorResponseInterface &
  Partial<Pick<OtrsRawTicketInterface, 'TicketID' | 'TicketNumber'>>;
