import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsObject,
  IsString,
  NotContains,
  ValidateNested,
} from 'class-validator';

type MailerType = 'logs' | 'mailjet';

export class MailFrom {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly name: string;
}

export class MailTo {
  @IsEmail()
  @NotContains('localhost')
  readonly email: string;

  @IsString()
  readonly name: string;
}

class MailjetOptions {
  @IsString()
  readonly proxyUrl: string;
}

export class MailerConfig {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly templatePaths: string[];

  @IsString()
  readonly transport: MailerType;

  @IsString()
  readonly key: string;

  @IsString()
  readonly secret: string;

  @ValidateNested()
  @Type(/* istanbul ignore next */ () => MailjetOptions)
  readonly options: MailjetOptions;

  @IsObject()
  @ValidateNested()
  @Type(/* istanbul ignore next */ () => MailFrom)
  readonly from: MailFrom;
}
