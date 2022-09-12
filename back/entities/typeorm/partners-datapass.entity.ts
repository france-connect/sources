import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ServiceProvider } from './partners-service-provider.entity';

@Entity()
export class Datapass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'integer',
    unique: true,
  })
  remoteId: number;

  @ManyToOne(() => ServiceProvider, { onDelete: 'CASCADE' })
  serviceProvider: ServiceProvider;

  @CreateDateColumn()
  createdAt: Date;
}
