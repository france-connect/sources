import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PartnersAccountPermission } from './partners-account-permission.entity';

@Entity()
export class PartnersAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  sub: string; // claim `sub`

  @Column({
    type: 'text',
    unique: true,
  })
  email: string; // claim `email`

  @Column({
    type: 'text',
  })
  firstname: string; // claim `given_name`

  @Column({
    type: 'text',
  })
  lastname: string; // claim `usual_name`

  @Column({
    type: 'char',
    length: 9, // https://portal.hardis-group.com/doccenter/pages/viewpage.action?pageId=120357227
    nullable: true,
  })
  siren: string | null; // claim `siren`

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastConnection?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(
    () => PartnersAccountPermission,
    (accountPermission) => accountPermission.account,
  )
  accountPermissions: PartnersAccountPermission[];
}
