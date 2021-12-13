/* istanbul ignore file */

// declarative file
import { IsDate, IsString } from 'class-validator';

export class TrackDto {
  @IsString()
  accountId: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsDate()
  date: Date;

  @IsString()
  event: string;

  @IsString()
  spAcr: string;

  @IsString()
  spId: string;

  @IsString()
  spName: string;

  @IsString()
  trackId: string;
}
