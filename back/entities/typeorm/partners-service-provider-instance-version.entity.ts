import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OidcClientInterface } from '@fc/service-provider';

import { PartnersServiceProviderInstance } from './partners-service-provider-instance.entity';

export enum PublicationStatusEnum {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  FAILED = 'FAILED',
}

@Entity()
@Index('version_unique_published', ['instance'], {
  unique: true,
  where: `"publicationStatus" = 'PUBLISHED'`,
})
export class PartnersServiceProviderInstanceVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PublicationStatusEnum,
    default: PublicationStatusEnum.DRAFT,
  })
  publicationStatus: string;

  @ManyToOne(() => PartnersServiceProviderInstance, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  instance: PartnersServiceProviderInstance;

  @Column({
    type: 'json',
    default: '{}',
  })
  data: OidcClientInterface;

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
