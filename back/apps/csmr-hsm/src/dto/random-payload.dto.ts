import { Max, Min } from 'class-validator';

import { IsBufferEncoding } from '@fc/common';

export class RandomPayloadDto {
  /**
   * Min length for securty reasons
   * Max length to avoid overloading HSM
   */
  @Min(32)
  @Max(8192)
  readonly length: number;

  @IsBufferEncoding()
  readonly encoding: BufferEncoding;
}
