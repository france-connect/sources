/* istanbul ignore file */

// Declarative file
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class I18nSession {
  @IsString()
  @Expose()
  readonly language: string;
}
