import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import {
  OtrsRawArticleInterface,
  OtrsRawDynamicFieldInterface,
  OtrsTicketGetResponseInterface,
  OtrsTicketSearchResponseInterface,
  OtrsTicketUpdateRawResponseInterface,
} from '../interfaces';
import { OtrsErrorResponseDto } from './otrs-error-response.dto';

export class OtrsRawDynamicFieldDto implements OtrsRawDynamicFieldInterface {
  @IsString()
  Name: string;

  @IsOptional()
  @IsString()
  Value?: string | null;
}

export class OtrsRawArticleDto implements OtrsRawArticleInterface {
  @IsNumber()
  ArticleID: number;

  @IsNumber()
  ArticleNumber: number;

  @IsString()
  Subject: string;

  @IsString()
  Body: string;

  @IsString()
  ContentType: string;

  @IsOptional()
  @IsString()
  MimeType?: string;

  @IsOptional()
  @IsString()
  Charset?: string;

  @IsOptional()
  @IsString()
  ContentCharset?: string;

  @IsOptional()
  @IsString()
  From?: string;

  @IsOptional()
  @IsString()
  To?: string;

  @IsOptional()
  @IsString()
  Cc?: string | null;

  @IsOptional()
  @IsString()
  Bcc?: string | null;

  @IsOptional()
  @IsString()
  ReplyTo?: string | null;

  @IsOptional()
  @IsString()
  InReplyTo?: string | null;

  @IsOptional()
  @IsString()
  References?: string | null;

  @IsOptional()
  @IsString()
  MessageID?: string;

  @IsOptional()
  @IsNumber()
  IncomingTime?: number;

  @IsOptional()
  @IsString()
  SenderType?: string;

  @IsOptional()
  @IsString()
  SenderTypeID?: string;

  @IsOptional()
  @IsNumber()
  IsVisibleForCustomer?: number;

  @IsOptional()
  @IsNumber()
  TicketID?: number;

  @IsOptional()
  @IsNumber()
  CommunicationChannelID?: number;

  @IsOptional()
  @IsNumber()
  TimeUnit?: number;

  @IsOptional()
  @IsString()
  CreateTime?: string;

  @IsOptional()
  @IsNumber()
  CreateBy?: number;

  @IsOptional()
  @IsString()
  ChangeTime?: string;

  @IsOptional()
  @IsNumber()
  ChangeBy?: number;
}

class OtrsRawTicketDto {
  @IsNumber()
  TicketID: number;

  @IsString()
  TicketNumber: string;

  @IsString()
  Title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtrsRawDynamicFieldDto)
  DynamicField: OtrsRawDynamicFieldDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtrsRawArticleDto)
  Article: OtrsRawArticleDto[];
}

export class OtrsTicketSearchResponseDto
  extends OtrsErrorResponseDto
  implements OtrsTicketSearchResponseInterface
{
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  TicketID?: string[];
}

export class OtrsTicketGetResponseDto
  extends OtrsErrorResponseDto
  implements OtrsTicketGetResponseInterface
{
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtrsRawTicketDto)
  Ticket?: OtrsRawTicketDto[];
}

export class OtrsTicketUpdateRawResponseDto
  extends OtrsErrorResponseDto
  implements OtrsTicketUpdateRawResponseInterface
{
  @IsOptional()
  @IsNumber()
  TicketID?: number;

  @IsOptional()
  @IsString()
  TicketNumber?: string;
}
