/* istanbul ignore file */

// declarative file
import { Type } from 'class-transformer';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';

export class FormattedIdpDto {
  @IsString()
  uid: string;

  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsBoolean()
  active: boolean;

  @IsBoolean()
  isChecked: boolean;
}

export class FormattedIdpSettingDto {
  @IsBoolean()
  allowFutureIdp: boolean;

  @ValidateNested()
  @Type(() => FormattedIdpDto)
  idpList: FormattedIdpDto;

  @ValidateNested()
  @Type(() => FormattedIdpDto)
  updatedIdpSettingsList: FormattedIdpDto[];

  @IsBoolean()
  hasAllowFutureIdpChanged: boolean;

  @IsString()
  updatedAt: string;
}
