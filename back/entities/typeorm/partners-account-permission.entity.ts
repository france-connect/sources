import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import {
  EntityType,
  PermissionsType,
} from '../../libs/access-control/src/enums';
import { Account } from './partners-account.entity';

@Entity()
export class AccountPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.accountPermissions)
  account: Account;

  // Dynamic Foreign Key - do not confuse with EntityId for sp
  @Column({
    type: 'uuid',
    default: null,
  })
  entityId: string;

  @Column({
    type: 'enum',
    enum: EntityType,
    default: null,
  })
  entity: EntityType;

  @Column({
    type: 'enum',
    enum: PermissionsType,
  })
  permissionType: PermissionsType;
}
