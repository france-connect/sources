import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Datapass } from './partners-datapass.entity';
import { Organisation } from './partners-organisation.entity';
import { Platform } from './partners-platform.entity';

export enum Status {
  SANDBOX = 'SANDBOX',
  REVIEW_REQUESTED = 'REVIEW_REQUESTED',
  REVIEW_IN_PROGRESS = 'REVIEW_IN_PROGRESS',
  REVIEW_VALIDATED = 'REVIEW_VALIDATED',
  REVIEW_REFUSED = 'REVIEW_REFUSED',
  REVIEW_WAITING_CLIENT_FEEDBACK = 'REVIEW_WAITING_CLIENT_FEEDBACK',
  PRODUCTION_ACCESS_PENDING = 'PRODUCTION_ACCESS_PENDING',
  PRODUCTION_READY = 'PRODUCTION_READY',
  PRODUCTION_LIVE = 'PRODUCTION_LIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity()
export class ServiceProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @ManyToOne(() => Platform)
  platform: Platform;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.SANDBOX,
  })
  status: string;

  @ManyToOne(
    () => Organisation,
    (organisation) => organisation.serviceProviders,
    { onDelete: 'CASCADE' },
  )
  organisation: Organisation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Datapass, (datapass) => datapass.serviceProvider, {
    onDelete: 'CASCADE',
  })
  datapasses: Datapass[];
}
