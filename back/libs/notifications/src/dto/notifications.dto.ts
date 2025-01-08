import { IsString } from 'class-validator';

export class NotificationsDto {
  @IsString()
  readonly message: string;
}
