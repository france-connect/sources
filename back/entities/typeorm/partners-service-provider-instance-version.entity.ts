import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PartnersServiceProviderInstance } from './partners-service-provider-instance.entity';

export enum PublicationStatusEnum {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
}

@Entity()
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
  data: Record<string, unknown>;

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
