import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PartnersAccount } from './partners-account.entity';
import { PartnersServiceProvider } from './partners-service-provider.entity';
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
    type: 'enum',
    enum: EnvironmentEnum,
    nullable: false,
  })
  environment: EnvironmentEnum;

  @Column({
    type: 'boolean',
    default: false,
  })
  markedForDeletion: boolean;

  @OneToMany(
    () => PartnersServiceProviderInstanceVersion,
    (version: PartnersServiceProviderInstanceVersion) => version.instance,
    {
      onDelete: 'CASCADE',
    },
  )
  versions: PartnersServiceProviderInstanceVersion[];

  @OneToOne(() => PartnersServiceProviderInstanceVersion)
  @JoinColumn()
  currentVersion: PartnersServiceProviderInstanceVersion;

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

  @ManyToOne(() => PartnersAccount, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  creator: PartnersAccount;

  @ManyToOne(() => PartnersServiceProvider, {
    onDelete: 'CASCADE',
  })
  serviceProvider: PartnersServiceProvider;
}
