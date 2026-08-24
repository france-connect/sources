import { IsNotEmpty, IsObject, IsString } from 'class-validator';

import { PresentationSubmission, WalletResponsePayload } from '../interfaces';

export class WalletResponsePayloadDto implements WalletResponsePayload {
  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @IsString()
  @IsNotEmpty()
  readonly vp_token: string;

  @IsObject()
  readonly presentation_submission: PresentationSubmission;
}
