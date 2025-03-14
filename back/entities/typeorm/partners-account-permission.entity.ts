import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

/**
 * typescripts paths are not working while using migration tool
 * @todo Find out why and fix to use aliases
 */
import {
  EntityType,
  PermissionsType,
} from '../../libs/access-control/src/enums';
import { PartnersAccount } from './partners-account.entity';

/**
 * Postgres <15 does not properly support UNIQUE indexes on NULL values,
 * so we use a special value to represent the absence of an entity ID.
 */
export const NO_ENTITY_ID = '00000000-0000-0000-0000-000000000000';

@Entity()
@Unique(['account', 'entityId', 'entity', 'permissionType'])
export class PartnersAccountPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PartnersAccount, (account) => account.accountPermissions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  account: PartnersAccount;

  @Column()
  accountId: string;

  // Dynamic Foreign Key - do not confuse with EntityId for sp
  @Column({
    type: 'uuid',
    default: NO_ENTITY_ID,
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
