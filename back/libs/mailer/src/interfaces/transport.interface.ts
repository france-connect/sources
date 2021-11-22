import { MailOptions } from '.';

export interface Transport {
  send(params: MailOptions): Promise<any>;
}
