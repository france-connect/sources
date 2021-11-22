import { IsString } from 'class-validator';

export class GetInteractionParamsDTO {
  @IsString()
  readonly uid: string;
}
