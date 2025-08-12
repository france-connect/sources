import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { MessageLevelEnum, MessagePriorityEnum } from '../enums';

export class FieldMessage {
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsEnum(MessageLevelEnum)
  readonly level: MessageLevelEnum;

  @IsEnum(MessagePriorityEnum)
  readonly priority: MessagePriorityEnum;
}
