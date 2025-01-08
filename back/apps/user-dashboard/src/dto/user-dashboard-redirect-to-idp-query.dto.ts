import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserDashboardFrontRoutes } from '../enums';

export class RedirectToIdpQueryDto {
  @IsString()
  @IsEnum(UserDashboardFrontRoutes)
  @IsOptional()
  redirectUrl?: string;
}
