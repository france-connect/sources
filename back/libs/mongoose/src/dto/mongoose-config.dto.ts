/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MongooseConfigOptions {
  @IsString()
  readonly authSource: string;

  @IsBoolean()
  readonly tls: boolean;

  @IsBoolean()
  readonly tlsInsecure: boolean;

  @IsString()
  @IsOptional()
  readonly tlsCAFile?: string;

  @IsBoolean()
  @IsOptional()
  readonly tlsAllowInvalidHostnames?: boolean;

  @IsBoolean()
  readonly useNewUrlParser: boolean;

  @IsBoolean()
  readonly useUnifiedTopology: boolean;
}

export class MongooseConfig {
  @IsString()
  @IsNotEmpty()
  readonly user: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly hosts: string;

  @IsString()
  @IsNotEmpty()
  readonly database: string;

  @IsObject()
  @ValidateNested()
  @Type(() => MongooseConfigOptions)
  readonly options: MongooseConfigOptions;
}
