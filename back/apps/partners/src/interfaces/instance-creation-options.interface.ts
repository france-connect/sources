import { EnvironmentEnum } from '@entities/typeorm';

export interface InstanceCreationOptionsInterface {
  environment: EnvironmentEnum;
  grantInstanceContributor: boolean;
}
