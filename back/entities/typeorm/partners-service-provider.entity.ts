import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PartnersOrganisation } from './partners-organisation.entity';
import { PartnersPlatform } from './partners-platform.entity';

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
    nullable: true,
  })
  organizationName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  datapassRequestId: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  authorizedScopes: string[];

  @ManyToOne(() => PartnersPlatform)
  platform: PartnersPlatform;

  @ManyToOne(
    () => PartnersOrganisation,
    (organisation) => organisation.serviceProviders,
    { onDelete: 'CASCADE' },
  )
  organisation: PartnersOrganisation;

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
