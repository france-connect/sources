export namespace Maildev {
  export interface From {
    address: string;
    name: string;
  }

  export interface To {
    address: string;
    name: string;
  }

  export interface Headers {
    'content-type': string;
    from: string;
    to: string;
    subject: string;
    'x-some-header': string;
    'x-mailer': string;
    date: string;
    'message-id': string;
    'mime-version': string;
  }

  export interface Attachment {
    contentType: string;
    contentDisposition: string;
    fileName: string;
    generatedFileName: string;
    contentId: string;
    checksum: string;
  }

  export interface Envelope {
    from: string;
    to: string[];
    host: string;
    remoteAddress: string;
  }

  export interface Mail {
    id: string;
    time: Date;
    from: From[];
    to: To[];
    subject: string;
    text: string;
    html: string;
    headers: Headers;
    read: boolean;
    messageId: string;
    priority: string;
    attachments: Attachment[];
    envelope: Envelope;
  }
}
