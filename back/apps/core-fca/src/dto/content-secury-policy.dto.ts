import { IsArray, IsString } from 'class-validator';

export class ContentSecurityPolicy {
  @IsArray()
  @IsString({ each: true })
  connectSrc: string[];

  @IsArray()
  @IsString({ each: true })
  defaultSrc: string[];

  @IsArray()
  @IsString({ each: true })
  styleSrc: string[];

  @IsArray()
  @IsString({ each: true })
  scriptSrc: string[];

  @IsArray()
  @IsString({ each: true })
  frameAncestors: string[];

  @IsArray()
  @IsString({ each: true })
  imgSrc: string[];
}
