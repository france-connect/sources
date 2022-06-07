/* istanbul ignore file */

// Declarative code
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class PostgresConfig {
  @IsString()
  // use of a reserved word exceptionally authorized based on postgres config
  readonly type: string;

  @IsString()
  readonly host: string;

  @IsNumber()
  readonly port: number;

  @IsString()
  readonly database: string;

  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  /**
   * We want instantiable only value (classes).
   * This protection is not enough to prevent errors but will help reduce the risk.
   */
  @IsArray()
  readonly entities: (new () => unknown)[];

  @IsBoolean()
  readonly synchronize: false;
}
