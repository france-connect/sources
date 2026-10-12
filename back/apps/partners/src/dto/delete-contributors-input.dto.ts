import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class DeleteContributorsInputDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  readonly accountIds: string[];
}
