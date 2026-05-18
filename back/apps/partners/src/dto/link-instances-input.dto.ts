import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class LinkInstancesInputDto {
  @IsUUID(4)
  readonly serviceProviderId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  readonly instanceIds: string[];
}
