import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PartnersServiceProviderInstanceVersion } from './partners-service-provider-instance-version.entity';

export enum EnvironmentEnum {
  SANDBOX = 'SANDBOX',
  PRODUCTION = 'PRODUCTION',
}

@Entity()
export class PartnersServiceProviderInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: EnvironmentEnum,
    nullable: false,
  })
  environment: EnvironmentEnum;

  @OneToMany(
    () => PartnersServiceProviderInstanceVersion,
    (version: PartnersServiceProviderInstanceVersion) => version.instance,
  )
  versions: PartnersServiceProviderInstance[];

  @CreateDateColumn({
    default: () => 'NOW()',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'NOW()',
    nullable: false,
  })
  updatedAt: Date;
}
