import { ArrayNotEmpty, IsArray, IsEmail, IsUUID } from 'class-validator';

export class InvitationInputDto {
  @IsEmail({}, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  readonly emails: string[];

  @IsUUID(4, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  readonly instances: string[];
}
