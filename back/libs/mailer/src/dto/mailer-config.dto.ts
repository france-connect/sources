/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  NotContains,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

type MailerType = 'logs' | 'smtp';

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

class SmtpOptions {
  @IsOptional()
  @MinLength(1)
  @IsString()
  readonly proxyUrl?: string;

  @IsString()
  readonly host: string;

  @IsNumber()
  readonly port: number;

  @IsBoolean()
  readonly secure: boolean;
}

export class MailerConfig {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly templatePaths: string[];

  @IsString()
  readonly transport: MailerType;

  @ValidateNested()
  @Type(() => SmtpOptions)
  @ValidateIf(({ transport }) => transport === 'smtp')
  readonly options: SmtpOptions;

  @IsObject()
  @ValidateNested()
  @Type(() => MailFrom)
  readonly from: MailFrom;
}
