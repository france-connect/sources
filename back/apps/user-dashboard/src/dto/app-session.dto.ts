import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserDashboardFrontRoutes } from '../enums';

export class AppSession {
  @IsString()
  @IsEnum(UserDashboardFrontRoutes)
  @IsOptional()
  readonly redirectUrl?: string;
}
