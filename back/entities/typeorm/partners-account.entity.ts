import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AccountServiceProvider } from './partners-account-service-provider.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 128,
    unique: true,
  })
  email: string;

  @Column({
    type: 'char',
    length: 128,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 64,
  })
  firstname: string;

  @Column({
    type: 'varchar',
    length: 64,
  })
  lastname: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => AccountServiceProvider,
    (accountServiceProvider) => accountServiceProvider.account,
  )
  accountServiceProviders: AccountServiceProvider[];
}
