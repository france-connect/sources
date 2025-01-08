import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/**
 * typescripts paths are not working while using migration tool
 * @todo Find out why and fix to use aliases
 */
import {
  EntityType,
  PermissionsType,
} from '../../libs/access-control/src/enums';
import { PartnersAccount } from './partners-account.entity';

@Entity()
export class PartnersAccountPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PartnersAccount, (account) => account.accountPermissions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  account: PartnersAccount;

  // Dynamic Foreign Key - do not confuse with EntityId for sp
  @Column({
    type: 'uuid',
    default: null,
  })
  entityId: string;

  @Column({
    type: 'enum',
    enum: EntityType,
    nullable: true,
    default: null,
  })
  entity: EntityType;

  @Column({
    type: 'enum',
    enum: PermissionsType,
  })
  permissionType: PermissionsType;
}
