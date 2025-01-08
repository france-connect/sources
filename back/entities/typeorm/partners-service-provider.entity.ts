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

  @ManyToOne(() => PartnersPlatform)
  platform: PartnersPlatform;

  @ManyToOne(
    () => PartnersOrganisation,
    (organisation) => organisation.serviceProviders,
    { onDelete: 'CASCADE' },
  )
  organisation: PartnersOrganisation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
