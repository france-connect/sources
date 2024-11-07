/* istanbul ignore file */

// Declarative code
import { IsEmail, IsString } from 'class-validator';

import { AppRmqConfig as AppRmqGenericConfig } from '@fc/app';

export class AppRmqConfig extends AppRmqGenericConfig {
  @IsEmail()
  readonly fraudEmailAddress: string;

  @IsString()
  readonly fraudEmailRecipient: string;

  @IsString()
  readonly fraudEmailSubject: string;
}
