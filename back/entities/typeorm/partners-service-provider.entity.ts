import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PartnersOrganization } from './partners-organization.entity';
import { PartnersPlatform } from './partners-platform.entity';
import { PartnersServiceProviderInstance } from './partners-service-provider-instance.entity';

@Entity()
export class PartnersServiceProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  datapassRequestId: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  datapassAuthorizationId: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  datapassEidasLevel: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  datapassScopes: string[];

  @ManyToOne(() => PartnersPlatform)
  platform: PartnersPlatform;

  @ManyToOne(
    () => PartnersOrganization,
    (organization) => organization.serviceProviders,
    { onDelete: 'CASCADE' },
  )
  organization: PartnersOrganization;

  @OneToMany(
    () => PartnersServiceProviderInstance,
    (instance: PartnersServiceProviderInstance) => instance.serviceProvider,
    { onDelete: 'CASCADE' },
  )
  instances: PartnersServiceProviderInstance[];

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
