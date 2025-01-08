import { Attachment } from 'nodemailer/lib/mailer';

interface MailFrom {
  readonly email: string;
  readonly name: string;
}

interface MailTo {
  readonly email: string;
  readonly name: string;
}

interface ReplyTo {
  readonly email: string;
  readonly name: string;
}

export interface MailOptions {
  readonly subject: string;
  readonly body: string;
  readonly from: MailFrom;
  readonly to: MailTo[];
  readonly replyTo?: ReplyTo;
  readonly attachments?: Attachment[];
}
