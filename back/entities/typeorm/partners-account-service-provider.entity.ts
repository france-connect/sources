import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Account } from './partners-account.entity';
import { ServiceProvider } from './partners-service-provider.entity';

@Entity()
@Index(['accountId', 'serviceProviderId'], { unique: true })
export class AccountServiceProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountId: string;

  @Column()
  serviceProviderId: string;

  @ManyToOne(
    () => ServiceProvider,
    (serviceProvider) => serviceProvider.accountServiceProviders,
  )
  serviceProvider: ServiceProvider;

  @ManyToOne(() => Account, (account) => account.accountServiceProviders)
  account: Account;
}
