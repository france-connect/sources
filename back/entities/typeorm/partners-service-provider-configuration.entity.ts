import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { EnvironmentEnum } from '../../libs/partner-service-provider-configuration/src/enums';
import { ServiceProvider } from './partners-service-provider.entity';

@Entity()
@Unique(['name', 'serviceProvider'])
export class ServiceProviderConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: EnvironmentEnum,
    nullable: false,
  })
  environment: EnvironmentEnum;

  @ManyToOne(() => ServiceProvider, { onDelete: 'CASCADE', nullable: false })
  serviceProvider: ServiceProvider;

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
