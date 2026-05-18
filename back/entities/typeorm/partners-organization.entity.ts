import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PartnersServiceProvider } from './partners-service-provider.entity';

@Entity()
export class PartnersOrganization {
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
  siret: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => PartnersServiceProvider,
    (serviceProvider: PartnersServiceProvider) => serviceProvider.organization,
  )
  serviceProviders: PartnersServiceProvider[];
}
