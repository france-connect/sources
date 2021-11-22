interface MailFrom {
  readonly email: string;
  readonly name: string;
}

interface MailTo {
  readonly email: string;
  readonly name: string;
}

export interface MailOptions {
  readonly subject: string;
  readonly body: string;
  readonly from: MailFrom;
  readonly to: MailTo[];
}
